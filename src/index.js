import {JSDOM} from 'jsdom'

export function toSecureName(name) {
	return name.toLowerCase().replaceAll(' ', '-')
}

export async function existGirl(secureName) {
	const name = toSecureName(secureName)
	const num = await getImagesNum(name)
  return {exist: !!num, num}
}

export function getLinkImage(secureName, num) {
	return getLink(secureName, num, 'image')
}

export function getLinkVideo(secureName, num) {
	return getLink(secureName, num, 'video')
}

function getLink(secureName, num, ext) {
	ext = ext === 'image' ? '.jpg' : ext === 'video' ? '.mp4' : null
	if (!ext) throw new Error('Type is invalid')

	const name = secureName
	const page = Math.ceil((num + 1) / 1000) * 1000
	const numstr = num.toString().padStart(4, '0')
	const ch1 = name.at(0)
	const ch2 = name.at(1)
	const endpoint = 'https://fapello.com/content'
	const file = `${name}_${numstr}${ext}`
	return `${endpoint}/${ch1}/${ch2}/${name}/${page}/${file}`
}

async function getImagesNum(secureName) {
	const result = await fetch(`https://fapello.com/${secureName}/`)
	if (!result.ok) return 0
	const data = await result.text()

	const jsdom = new JSDOM(data)
	const document = jsdom.window.document

	if (document.title.toLowerCase() === 'fapello') return 0
	
	const countStr = document
		.querySelector('.divide-gray-300')
		.children[0].textContent.replace('Media', '')
		.trim()

	return parseInt(countStr)
}