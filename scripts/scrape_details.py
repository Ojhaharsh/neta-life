import csv
import json
import time
import re
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

def fetch_mp_data(mp_id, mp_name):
    url_name = re.sub(r'[^a-z0-9]+', '-', mp_name.lower()).strip('-')
    url = f"https://prsindia.org/mptrack/18th-lok-sabha/{url_name}"
    
    try:
        r = requests.get(url, timeout=15)
        if r.status_code != 200:
            return mp_id, None
            
        soup = BeautifulSoup(r.text, 'html.parser')
        mp_data = {'debates': [], 'questions': []}
        
        tables = soup.find_all('table')
        for table in tables:
            headers = [th.text.strip().lower() for th in table.find_all('th')]
            if not headers:
                continue
                
            rows = table.find_all('tr')[1:] # Skip header
            
            # Check if it's the Debates table
            if 'debate title/bill name' in headers or 'debate type' in headers:
                for row in rows[:5]: # Get top 5
                    cols = [td.text.strip() for td in row.find_all('td')]
                    if len(cols) >= 3:
                        mp_data['debates'].append({
                            'date': cols[0],
                            'title': cols[1],
                            'type': cols[2]
                        })
            
            # Check if it's the Questions table
            elif 'title' in headers and 'ministry or category' in headers:
                for row in rows[:5]: # Get top 5
                    cols = [td.text.strip() for td in row.find_all('td')]
                    if len(cols) >= 4:
                        mp_data['questions'].append({
                            'date': cols[0],
                            'title': cols[1],
                            'type': cols[2],
                            'ministry': cols[3]
                        })
        
        return mp_id, mp_data
        
    except Exception as e:
        print(f"Error fetching {mp_name}: {e}")
        return mp_id, None

def main():
    print("Reading MPs from CSV...")
    mps = []
    with open('../data/prs_18th.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['mp_name']:
                mps.append((row['mp_election_index'], row['mp_name']))
                
    print(f"Found {len(mps)} MPs. Scraping details...")
    
    all_details = {}
    
    # We use ThreadPoolExecutor to scrape faster
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        for mp_id, mp_name in mps:
            futures.append(executor.submit(fetch_mp_data, mp_id, mp_name))
            
        for idx, future in enumerate(futures):
            mp_id, data = future.result()
            if data:
                all_details[mp_id] = data
            if (idx + 1) % 50 == 0:
                print(f"Processed {idx + 1}/{len(mps)} MPs")
                
    print(f"Successfully scraped {len(all_details)} MPs.")
    
    with open('../data/mp_details.json', 'w', encoding='utf-8') as f:
        json.dump(all_details, f, ensure_ascii=False)
        
    print("Saved to data/mp_details.json")

if __name__ == "__main__":
    main()
