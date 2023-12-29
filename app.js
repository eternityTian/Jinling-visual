async function drawChart() {
	const data = await d3.json("./data/jinling_poetry.json");

	const svg = d3.select("#chart");
	const bounds = svg.append("g");

	// console.log([...new Set(data.map((d) => d.style))]);
	// ["Surrealism", "Realism", "Expressionism", "Cubism", "Op Art", "Art Nouveau (Modern)", "Northern Renaissance", "Art Deco"]


	data.map((d) => {
		d.date = d.date !== "?" ? +d.date : "?";
		d.style = d.style === "Op Art" ? "Optical art" : d.style;
		d.style2 = d.style;
	});
	//   d.style2 = [
	//     "乐府诗",
	//     "五言古体诗",
	//     "四言古体诗",
	//     "七言古体诗",
	//     "杂言诗",
	//  ""
	//   ].includes(d.style)
	//     ? d.style
	//     : "未知";

	console.log(data);


	// https://observablehq.com/@d3/d3-group
	const styleCountMap = d3.rollup(
		data,
		(v) => v.length,
		(d) => d.style2
	);
	// console.log("styleCount :", styleCountMap);
	const styleCount = [];
	for (const [style, count] of styleCountMap) {
		styleCount.push({
			style,
			count
		});
	}
	console.log(styleCount);
	// drawStyleLegend() 里会用到

	// 一列最多8组共24个；分成7个年龄组
	// 1898-1917 = 14
	// 1918-1927 = 28*3+1 = 85 // 99
	// 1928-1937 = 7*8*3+6 = 174 // 273
	// 1938-1947 = 62 // 335
	// 1948-1957 = 27 * 3 = 81 // 416
	// 1958-1972 = 14*3-1 = 41 // 457
	// 1973- = 13
	// 分八个朝代
	const dateGroup = d3.range(8).map(() => []);
	const dynastyMap = new Map();
	const dynastiesArray = ['六朝', '唐', '南唐', '宋', '元', '明', '清', '当代'];
	dynastiesArray.forEach((dynasty, index) => {
		dynastyMap.set(dynasty, index);
	});
	data.forEach((d) => {
		dynasty = d.dynasty;
		const index = dynastyMap.get(dynasty);
		if (index !== undefined) {
			dateGroup[index].push(d);
		} else {
			console.error(`Dynasty "${dynasty}" not found in dynastyMap.`);
		}
	});
	/* data.forEach((d) => {
	  date = d.date;
	  if (date === "?") dateGroup[6].push(d);
	  else if (date < 1918) dateGroup[0].push(d);
	  else if (date < 1928) dateGroup[1].push(d);
	  else if (date < 1938) dateGroup[2].push(d);
	  else if (date < 1948) dateGroup[3].push(d);
	  else if (date < 1958) dateGroup[4].push(d);
	  else if (date < 1973) dateGroup[5].push(d);
	}); */
	console.log(dateGroup);
	// getXY() 里年龄段已经通过索引 idx 分段写死；这里 dateGroup 仅供个人浏览

	const colorScale = {
		"未知": "#ffc533",
		"五言古体诗": "#ff5500",
		"杂言诗": "#f25c3b",
		"乐府诗": "#5991c2",
		"四言古体诗": "#55514e",
		"七言古体诗": "#5aa459",
		// "未知": "#bdb7b7",
		"词": "#5fb9bd",
		"七言律绝": "#a0bd0e",
		"七言律诗": "#0ebdaf",
		"五言律诗": "#ebeb0a",
		"五言律绝": "#b9f6ff",
		"散曲": "#ffaa7f",
		"五言排律": "#ffaaff",
		"六言古体诗": "#bdac98",
		"四言古体诗": "#bbb505",
		"七言排律": "#aaaaff",
		"六言律绝": "#ffff7f",
		"楚辞": "#aa55ff",
		"地方志": "#a2bba3",
		"序跋文": "#55aaff",
	};

	const getXYByGroupInfo = (groupId, id) => {

	}
	const getXY = (idx) => {
		let col;
		let row;
		if (idx < 162) {
			groupIdx = idx;
			col = 0 + parseInt(groupIdx / 24) + 1;
			row = parseInt((idx % 24) / 3) + 1;
		} else if (idx < 426) {
			groupIdx = idx - 162;
			col = 7 + parseInt(groupIdx / 24) + 1;
			row = parseInt((groupIdx % 24) / 3) + 1;
		} else if (idx < 500) {
			groupIdx = idx - 426;
			col = 18 + parseInt(groupIdx / 24) + 1;
			row = parseInt((groupIdx % 24) / 3) + 1;
		} else if (idx < 572) {
			groupIdx = idx - 500;
			col = 22 + parseInt(groupIdx / 24) + 1;
			row = parseInt((groupIdx % 24) / 3) + 1;
		} else if (idx < 599) {
			groupIdx = idx - 572;
			col = 25 + parseInt(groupIdx / 24) + 1;
			row = parseInt((groupIdx % 24) / 3) + 1;
		} else if (idx < 818) {
			groupIdx = idx - 599;
			col = 27 + parseInt(groupIdx / 24) + 1;
			row = parseInt((groupIdx % 24) / 3) + 1;
		} else if (idx < 943) {
			groupIdx = idx - 818;
			col = 37 + parseInt(groupIdx / 24) + 1;
			row = parseInt((groupIdx % 24) / 3) + 1;
		} else if (idx < 944) {
			groupIdx = idx - 943;
			col = 43 + parseInt(groupIdx / 24) + 1;
			row = parseInt((groupIdx % 24) / 3) + 1;
		}
		return [groupIdx, col, row];
	};

	// 方法1
	const cubeWidth = 32;
	// 方法2
	// const cubeWidth = (32 / 2) * Math.sqrt(3); // 36; // 40

	//  2%3=2  parseInt(4/3)=1  or Math.floor(4/3)
	const artworkGroup = bounds
		.append("g")
		.attr("class", "main-chart")
		.attr("transform", `scale(1.12)`);

	function drawArtwork() {
		const artworks = artworkGroup
			.selectAll("use.artwork")
			.data(data)
			.join("use")
			.attr("class", "artwork")
			.attr("xlink:href", (d, i) =>
				getXY(i)[0] % 3 === 0 ?
				"#unit-0" :
				getXY(i)[0] % 3 === 1 ?
				"#unit-1" :
				"#unit-2"
			)
			.attr("fill", (d) => colorScale[d.style2])
			.attr("stroke", "white")
			.attr("data-index", (d) => d.style2)
			.attr("id", (d, i) => i)
			// 40 cubeWidth=40  x -150 // y 70+
			// 36 cubeWidth=36  x -80 // y 110+
			.attr("x", (d, i) => getXY(i)[1] * 1.5 * cubeWidth - 80)
			.attr(
				"y",
				(d, i) =>
				110 +
				getXY(i)[2] * 1.5 * cubeWidth +
				(getXY(i)[1] % 2 === 0 ? 0 : 0.75 * cubeWidth)
			);
	}
	drawArtwork();

	function drawBlankArtwork() {
		// bottom odd 9 / even 10
		const rawMax = [
			8,
			8,
			8,
			8,
			8,
			8,
			6,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			1,
			8,
			8,
			8,
			8,
			1,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			1,
			8,
			8,
			8,
			8,
			8,
			2,
			1,
		];
		// 加空白
		const blank = [];
		d3.range(1, 45).map((d) => {
			// top odd 0/-1 / even 0
			d % 2 === 0 ?
				blank.push({
					x: d,
					y: 0
				}) :
				blank.push({
					x: d,
					y: 0
				}, {
					x: d,
					y: -1
				});
			// bottom odd 9 / even 10
			if (d % 2 === 0) {
				for (let i = rawMax[d - 1] + 1; i <= 11; i++)
					blank.push({
						x: d,
						y: i
					});
			} else {
				for (let i = rawMax[d - 1] + 1; i <= 10; i++) blank.push({
					x: d,
					y: i
				});
			}
		});
		// console.log(blank);

		let blankData = [];
		blank.map((d) => {
			// repeat 3 times
			d3.range(3).map(() => blankData.push({
				x: d.x,
				y: d.y
			}));
		});
		const specialBlank = [
			// { x: 50, y: 3, unit: 3 },
			// { x: 5, y: 5, unit: 1 },
			// { x: 5, y: 5, unit: 2 },
			// { x: 16, y: 5, unit: 2 },
			// { x: 22, y: 6, unit: 2 },
			// { x: 23, y: 5, unit: 1 },
			// { x: 23, y: 5, unit: 2 },
		];
		blankData = [...blankData, ...specialBlank];

		const blankArtworks = artworkGroup
			.selectAll("use.blank")
			.data(blankData)
			.join("use")
			.attr("class", "blank")
			.attr("xlink:href", (d, i) =>
				d.unit ?
				`#unit-${d.unit}` :
				i % 3 === 0 ?
				"#unit-0" :
				i % 3 === 1 ?
				"#unit-1" :
				"#unit-2"
			)
			.attr("fill", "#f2f2e8")
			.attr("stroke", "white")
			.attr("stroke-width", 1)
			.attr("x", (d) => d.x * 1.5 * cubeWidth - 80)
			.attr(
				"y",
				(d) =>
				110 + d.y * 1.5 * cubeWidth + (d.x % 2 === 0 ? 0 : 0.75 * cubeWidth)
			);
	}

	drawBlankArtwork();

	const tooltip = d3.select("#tooltip");

	svg.on("click", displayTooltip);

	function displayTooltip() {
		tooltip.style("opacity", 0);
	}

	d3.selectAll("use.artwork").on("click", showTooltip);
	// .on('mouseleave', onMouseLeave)

	function showTooltip(datum) {
		console.log(this)
		console.log(datum)
		tooltip.style("opacity", 1);
		tooltip.select("#title").text(datum.title);
		tooltip.select("#author").text(datum.author);
		tooltip.select("#style").text(datum.style);
		tooltip.select("#content").text(datum.content);
		//tooltip.select("#other-content").text(datum.other_content);

		let [x, y] = d3.mouse(this);
		// console.log(x, y);
		x = x > 700 ? x - 300 : x;
		y = y > 450 ? y - 300 : y;
		tooltip.style("left", `${x + 100}px`).style("top", `${y + 50}px`);

		d3.event.stopPropagation();
	}

	// function onMouseLeave() {
	//     tooltip.style('opacity', 0)
	// }

	function drawDateInfo() {
		const dateText = [{
				col: 1,
				shortLine: false,
				age: "",
				range: "222-598"
			},
			{
				col: 8,
				shortLine: true,
				age: "",
				range: "618-907"
			},
			{
				col: 19,
				shortLine: true,
				age: "",
				range: "937-975"
			},
			{
				col: 23,
				shortLine: true,
				age: "",
				range: "960-1279"
			},
			{
				col: 26,
				shortLine: false,
				age: "",
				range: "1271-1368"
			},
			{
				col: 28,
				shortLine: false,
				age: "",
				range: "1368-1644"
			},
			{
				col: 38,
				shortLine: false,
				age: "",
				range: "1616-1912"
			},
			{
				col: 44,
				shortLine: false,
				age: "",
				range: "1949- "
			},
			//       { col: 27, shortLine: false, age: "", range: "未知" },
		];
		dateText.forEach((item, index) => {
			item.age = dynastiesArray[index]
		})
		const dateTextGroup = artworkGroup.selectAll("g").data(dateText).join("g");

		dateTextGroup
			.append("text")
			.text((d) => d.age)
			.style("text-anchor", "start")
			.attr("x", (d, i) => d.col * 1.5 * cubeWidth + (i === 0 ? 34 : 42))
			.attr("y", 195)
			.attr("font-size", 13);

		dateTextGroup
			.append("text")
			.text((d) => d.range)
			.style("text-anchor", "start")
			.attr("x", (d, i) => d.col * 1.5 * cubeWidth + (i === 6 ? 30 : 35))
			.attr("y", 210)
			.attr("fill", "grey")
			.attr("font-size", 11);

		dateTextGroup
			.append("line")
			.attr("x1", (d, i) => d.col * 1.5 * cubeWidth + 63)
			.attr("x2", (d, i) => d.col * 1.5 * cubeWidth + 63)
			.attr("y1", 215)
			.attr("y2", (d) => (d.shortLine ? 246 : 270))
			.attr("stroke", "#2980b9")
			.attr("stroke-dasharray", "1px 1px");
	}

	drawDateInfo();

	function drawTitle() {
		// title
		const title = bounds
			.append("text")
			.text("金陵文脉")
			.attr("x", 90)
			.attr("y", 90)
			.attr("text-anchor", "start")
			.attr("font-size", 40)
			.attr("font-weight", "bold");

		const subTitle = bounds.append("g").attr("class", "sub-title");
		subTitle
			.append("text")
			.text("ChinaVis 2023")
			.attr("x", 90)
			.attr("y", 125)
			.attr("font-size", 16);

		subTitle
			.append("text")
			.text("作者 田宏志、龚峰、何思盈、李小玉、于卓仡")
			.attr("x", 90)
			.attr("y", 160)
			.attr("font-size", 16);

		subTitle
			.append("a")
			.attr("href", "https://chinavis.org/2023/challenge.html")
			.attr("target", "_blank")
			.append("text")
			.text("赛道2:「数观千年」人文可视化创意赛")
			.attr("x", 210)
			.attr("y", 125)
			.attr("fill", "#5991c2")
			.attr("font-size", 16);
	}
	drawTitle();

	// piece example
	function drawAnno() {
		const anno = bounds.append("g").attr("transform", "translate(530, 25)");

		const annoArtwork = anno
			.append("use")
			.attr("xlink:href", "#unit-0")
			.attr("fill", "#bdb7b7")
			.attr("x", 120)
			.attr("y", -30);

		const annoText = anno
			.append("text")
			.text("A piece of artwork(click it)")
			.attr("x", 180)
			.attr("y", 100)
			.attr("fill", "grey")
			.attr("font-size", 13);
	}
	drawAnno();

	// style bar chart
	function drawStyleLegend() {
		const countScale = d3
			.scaleLinear()
			.domain([0, d3.max(styleCount, (d) => d.count)])
			.range([0, 200]);

		const legend = bounds.append("g").attr("transform", "translate(1000, 40)");

		const legendTitle = legend
			.append("text")
			.text("各朝代的诗歌数量占比")
			.attr("x", 20)
			.attr("y", 10);

		const legendGroup = legend
			.selectAll("g")
			.data((styleCount.sort((a, b) => b.count - a.count)).slice(0,10))
			.join("g")
			.attr("transform", (d, i) => `translate(110, ${28 + 15 * i})`);

		const lengedStyleText = legendGroup
			.append("text")
			.text((d) => d.style) // this's style2
			.attr("x", -90)
			.attr("y", 6)
			.attr("text-anchor", "start")
			.attr("fill", "grey")
			.attr("font-size", 11);

		const lengedRect = legendGroup
			.append("rect")
			.attr("width", (d) => countScale(d.count))
			.attr("height", 8)
			.attr("fill", (d) => colorScale[d.style]);

		const lengedStyleCountText = legendGroup
			.append("text")
			.text((d) => d.count)
			.attr("x", (d) => countScale(d.count) + 10)
			.attr("y", 8)
			.attr("fill", (d) => colorScale[d.style])
			.attr("font-size", 11);
	}

	drawStyleLegend();
	
	// style bar chart
	function drawStyleLegend2() {
		const countScale = d3
			.scaleLinear()
			.domain([0, d3.max(styleCount, (d) => d.count)])
			.range([0, 200]);
	
		const legend = bounds.append("g").attr("transform", "translate(1350, 40)");
	
		const legendGroup = legend
			.selectAll("g")
			.data((styleCount.sort((a, b) => b.count - a.count)).slice(10,19))
			.join("g")
			.attr("transform", (d, i) => `translate(110, ${28 + 15 * i})`);
	
		const lengedStyleText = legendGroup
			.append("text")
			.text((d) => d.style) // this's style2
			.attr("x", -90)
			.attr("y", 6)
			.attr("text-anchor", "start")
			.attr("fill", "grey")
			.attr("font-size", 11);
	
		const lengedRect = legendGroup
			.append("rect")
			.attr("width", (d) => countScale(d.count))
			.attr("height", 8)
			.attr("fill", (d) => colorScale[d.style]);
	
		const lengedStyleCountText = legendGroup
			.append("text")
			.text((d) => d.count)
			.attr("x", (d) => countScale(d.count) + 10)
			.attr("y", 8)
			.attr("fill", (d) => colorScale[d.style])
			.attr("font-size", 11);
	}
	
	drawStyleLegend2();

	// data source  // author
	function drawDesc() {
		const descLeft = artworkGroup.append("g").attr("class", "desc-left");

		descLeft
			.append("text")
			.text("Data source: ")
			.attr("x", 80)
			.attr("y", 690)
			.attr("font-size", 12);

		descLeft
			.append("a")
			.attr("href", "https://chinavis.org/2023/challenge.html")
			.attr("target", "_blank")
			.append("text")
			.text("https://chinavis.org/2023/challenge.html")
			.attr("x", 175)
			.attr("y", 690)
			.attr("fill", "#5991c2")
			.attr("font-size", 12);

		const descRight = artworkGroup.append("g").attr("class", "desc-right");

		descRight
			.append("text")
			.text("Origin: Tableau | Wendy Shijia | @ShijiaWendy | 24 August 2020 | ")
			.attr("x", 604)
			.attr("y", 680)
			.attr("font-size", 12);

		descRight
			.append("a")
			.attr(
				"href",
				"https://public.tableau.com/profile/wendy.shijia#!/vizhome/MCEschersGallery_15982882031370/Gallery"
			)
			.attr("target", "_blank")
			.append("text")
			.text("Tableau: Wendy Shijia/Escher's Gallery")
			.attr("x", 970)
			.attr("y", 680)
			.attr("fill", "#5991c2")
			.attr("font-size", 12);

		descRight
			.append("text")
			.text("Reproduced: D3.js | 古柳Guliu | @Deserts_X | 22 October 2020 | ")
			.attr("x", 604)
			.attr("y", 700)
			.attr("font-size", 12);

		descRight
			.append("a")
			.attr("href", "https://github.com/DesertsX/dataviz-in-action")
			.attr("target", "_blank")
			.append("text")
			.text("GitHub: DesertsX/dataviz-in-action")
			.attr("x", 964)
			.attr("y", 700)
			.attr("fill", "#5991c2")
			.attr("font-size", 12);

		// Wendy Shijia @ShijiaWendy
		// https://twitter.com/ShijiaWendy/status/1297950623141203968

		// https://github.com/DesertsX/dataviz-in-action
		// @Deserts_X
		// https://twitter.com/Deserts_X
	}
	drawDesc();
}

drawChart();
