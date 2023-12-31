import csv
import json

csv_file_path = '../data/new_data.csv'  
json_file_path = '../data/jinling_poetry.json'

data = []
with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        data.append(row)

# 将数据转为JSON格式并写入文件
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=2)

print("文件转换完成")
