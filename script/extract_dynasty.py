import csv

csv_file_path = '../data/金陵历朝诗歌.csv'  # 替换为您的CSV文件路径

dynasty_set = set()

with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        dynasty_set.add(row['dynasty'])

dynasty_list = list(dynasty_set)

print('Dynastys:', dynasty_list)