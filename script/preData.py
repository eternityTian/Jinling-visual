from dataclasses import replace
import pandas as pd  
import random 

xlsx_file = r'F:\学校文件\数据可视化\赛道2金陵文脉数据集\金陵数据.xlsx'  
JLSJ = pd.read_excel(xlsx_file, sheet_name=0)

JLSG = pd.read_csv(r"F:\学校文件\数据可视化\赛道2金陵文脉数据集\金陵历朝诗歌.csv")
JLSJ = JLSJ.rename(columns={'作品名': 'title', '名字': 'author'})

# 去除书名号  
JLSJ['title'] = JLSJ['title'].str.replace('《|》', '') 

select_JLSJ = JLSJ[['title', 'author', '文体', '写作时间', '创作背景', '内容简介']]
  
data = pd.merge(JLSG, select_JLSJ, on=['title', 'author'], how='left') 

data.fillna('未知', inplace=True) 

data = data.rename(columns={'文体': 'style', '写作时间': 'time', '创作背景': 'back', '内容简介': 'introduction'})

data_unknown = data[data['style'] == '未知']
data_other = data[data['style'] != '未知']

df = data_unknown.sample(n=328, random_state=2023)

data = pd.concat([data_other, df], axis=0)
  
data['dynasty_label'] = data[['dynasty']]
dict = {"六朝": 1, "唐": 2, "南唐": 3, "宋": 4, "元": 5, "明": 6, "清": 7, "当代": 8, "未知": 9}
data["dynasty_label"] = data["dynasty_label"].map(dict)
data = data.sort_values(by='dynasty_label', ascending=True) 
data = data.drop('dynasty_label', axis=1)  

# 指定新的index值  
new_index = [i for i in range(len(data))]  
  
# 使用reindex方法重新赋值  
data['id'] = new_index 

df2 = pd.DataFrame({'id': 943,
                    'title': "断章",
                    'author': "卞之琳",
                    'content':"你站在桥上看风景，看风景人在楼上看你。明月装饰了你的窗子，你装饰了别人的梦。",
                    'dynasty': "当代",
                    'style': "未知",
                    'time': "未知",
                    'back': "未知",
                    'introduction': "未知",
                    },index=[0])

data = data.append(df2, ignore_index = True)
print(data['dynasty'].value_counts())
data.to_csv(r'F:\学校文件\数据可视化\new_data.csv', index=False)