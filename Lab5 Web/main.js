const id = id => document.getElementById(id);

id("swap_content").addEventListener("click", () => {
	const b1 = id("block_1");
	const b6 = id("block_6");
	const div = document.createElement("div");

	div.append(...b1.childNodes);
	b1.append(...b6.childNodes);
	b6.append(...div.childNodes);
});

id("delete").addEventListener("click", () => {
	for(let i=0; i<oldListCount; i++) {
	localStorage.removeItem("list"+i+"id");
	localStorage.removeItem("list"+i+"value");
	location.reload()
	}
});

const d1 = 5;
const d2 = 9;
id("block_3").append(
	document.createElement("br"),
	document.createTextNode("Діагональ d1 = " + d1),
	document.createElement("br"),
	document.createTextNode("Діагональ d2 = " + d2),
	document.createElement("br"),
	document.createTextNode("Площа S = " + (d1 * d2 / 2))
);


id("triangle").addEventListener("click", () => {
	const value = id("sides").value;
	let [a, b, c] = value.split(' ')
	a = Number(a)
	b = Number(b)
	c = Number(c)
	available = a + b > c && a + c > b && b + c > a
	document.cookie = "triangle="+available;
	if (available) {
		alert("Побудова трикутника можлива")
	}
	else{
		alert("Побудова трикутника неможлива")
	}
});


let allCookies = Object.fromEntries(document.cookie.split(";").map(keyVal => keyVal.split("=")));
if("triangle" in allCookies) {
	let str = ""
	if (allCookies.triangle != "true"){
		str += "не"
	}
	let test = confirm("Побудова трикутника зі сторонами "+ str +"можливо. Видаляємо cookies?");
	if (test) {
		document.cookie = "triangle=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
		alert("Значення видалено з cookie.\nНатиснення OK перезавантажить сторінку.");
		location.reload();
	}
	else{
		alert("Перезавантаж сторінку!");
	}
}


function setAlign() {
	const style = document.querySelector('input[name="fontstyle"]:checked')?.value ?? "normal";
	id("block_2").style["font-style"] = style;
	localStorage.setItem("style", style);
};

function restoreFromLocalStorage() {
	const style = localStorage.getItem("style") ?? "normal";
	document.querySelector('input[name="fontstyle"][value="'+style+'"]').checked = true;

}
id("block_2").addEventListener("mouseover", setAlign);
restoreFromLocalStorage();
setAlign();


const addListForm = id("block_add");
let currentNode = null;
var listCount = 0;
function genList(value) {
	var valueCount = 0;
	let list = document.createElement("ol");
	list.style.display = 'flex';
	list.style.width = '50%';
	list.style.flexDirection = 'column';
	value.split("\n").forEach(row => {
		valueCount++;
		let li = document.createElement("li");
		if (valueCount % 2 == 0){
			li.setAttribute("style", "background-color: black; color: white")
		}
		else{
			li.setAttribute("style", "background-color: white; color: black")
		}
		li.innerText = row;
		list.append(li);
	});
	return list;
}

document.addEventListener("selectionchange", (e) => {
	let node = window.getSelection().baseNode;
	if(!node) {
		return;
	}
	while(!(node === document.body || node.id?.startsWith("block_"))) {
		node = node.parentElement;
	}
	if(node === document.body) return;
	if(node.id === "block_add") return;
	if(node === currentNode) return;
	node.append(addListForm);
	currentNode = node;
});

id("cancel").addEventListener("click", () => {
	id("hide_block_add").append(addListForm);
	id("textarea").value = "";
	currentNode = null;
});

id("add").addEventListener("click", () => {
	const value = id("textarea").value;
	id("textarea").value = "";
	currentNode.insertBefore(genList(value), id("block_add"));

	localStorage.setItem("list"+listCount+"value", value);
	localStorage.setItem("list"+listCount+"id", currentNode.id);
	listCount++;

	localStorage.setItem("listCount", listCount);
});
const oldListCount = localStorage.getItem("listCount") ?? 0;
for(let i=0; i<oldListCount; i++) {
	id(localStorage.getItem("list"+i+"id")).append(genList(localStorage.getItem("list"+i+"value")));
}