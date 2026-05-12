import requests
from bs4 import BeautifulSoup
import json

url = "https://prsindia.org/mptrack/18th-lok-sabha/shashi-tharoor"
r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')

data = {'questions': [], 'debates': []}

# Try to find tables for questions and debates
tables = soup.find_all('table')
for i, table in enumerate(tables):
    print(f"Table {i}:")
    headers = [th.text.strip() for th in table.find_all('th')]
    print("Headers:", headers)
    
    rows = table.find_all('tr')[1:3] # just first 2 rows
    for row in rows:
        cols = [td.text.strip() for td in row.find_all('td')]
        print("Row:", cols)
    print("-" * 30)

