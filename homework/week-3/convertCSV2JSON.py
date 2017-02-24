import csv
import json

# open a CSV file and read all the dates and temperatures
csvdataset = open("tempdata.csv", 'rU')
names = ['YYMMDD', 'temp']
csvreader = csv.DictReader(csvdataset, names)

# open a JSON data set and write the rows of the csv to the JSON
jsondataset = open('JSON.json', 'w')
data = json.dumps([row for row in csvreader])
jsondataset.write(data)

# close both files
csvdataset.close()
jsondataset.close()

