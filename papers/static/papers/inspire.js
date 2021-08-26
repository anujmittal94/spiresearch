function api_to_url(api) {
  url = api.replace('/api/', '/')
  return url
}

function url_to_api(url) {
  api = url.replace('net/', 'net/api/')
  return api
}

function api_search(url, params) {
  var recid = url.substring(url.lastIndexOf('/') + 1)
  var url = new URL(url.substring(0, url.lastIndexOf('/')))
  params['q'] = 'recid:'.concat(recid)
  url.search = new URLSearchParams(params)
  return fetch(url)
  .then(response => response.json())
  .then(data => data.hits.hits[0].metadata)
}

function paper_info(data) {
    var info = {}

    info['title'] = (data.titles? data.titles[0].title:false)

    if (data.authors) {
        info['authors'] = []
        for (var i=0,j=data.authors.length;i<j;i++) {
            let name = info.authors.push(data.authors[i].full_name)
        }
    }
    else {info['authors'] = false}

    info['pub'] = (data.publication_info? data.publication_info[0]:false)

    info['abstract'] = (data.abstracts? data.abstracts[0]:false)

    info['citations'] = (data.citation_count? data.citation_count:false)

    info['arxiv'] = (data.arxiv_eprints? data.arxiv_eprints[0].value:false)

    info['references'] = (data.references? data.references:false)

    return info
}

function misc_info(data) {
    var info = {}

    info['title'] = (data.misc? data.misc[0]:false)

    if (data.authors) {
        info['authors'] = []
        for (var i=0,j=data.authors.length;i<j;i++) {
            let name = info.authors.push(data.authors[i].full_name)
        }
    }
    else {info['authors'] = false}

    info['pub'] = (data.publication_info? data.publication_info:false)

    return info
}


function rec_builder(data) {

    var title = (data.title? data.title:"Unavailable")

    var first = data.authors? data.authors[0]:"Unavailable"
    var autLen = Math.min(AUTCOUNT, data.authors.length)
    if (data.authors) {
        var autString = ''
        for (var i = 0; i < autLen; i++) {
            var author = data.authors[i].split(', ').reverse().join(' ')
            autString += author + ', '
        }
        autString = autString.substring(0, autString.length - 2)
        if (data.authors.length > autLen) {autString += " et al."}
    }
    else { autString = "Unavailable"}


    var journal = (data.pub.journal_title? data.pub.journal_title:"Unavailable")
    var pubString = (data.pub.journal_title?
     `${data.pub.journal_title? data.pub.journal_title:""}
      ${data.pub.journal_volume? data.pub.journal_volume:""}
      ${data.pub.page_start? data.pub.page_start:data.pub.artid? data.pub.artid:""}
      `:"Unavailable")

    var year = (data.pub.year? data.pub.year:'0000')
    var yearString = (data.pub.year? data.pub.year:'Unavailable')


    var citations = (data.citations? data.citations:"0")

    if (data.arxiv) {
        var arxiv = "https://arxiv.org/abs/" + data.arxiv
    }
    else {arxiv = "Unavailable"}

    var url = api_to_url(data.url)

    rowString = `
    <td data-sort=${title.toLowerCase()} class='title'>${title}</td>
    <td data-sort=${first.toLowerCase()} class='author'>${autString}</td>
    <td data-sort=${journal.toLowerCase()} class='journal'>${pubString}</td>
    <td data-sort=${year} class='year'>${yearString}</td>
    <td data-sort=${citations} class='citations'>${citations}</td>
    <td><a href=${url} class ='inspire' data-url=${url} target='_blank'>INSPIRE</a>
    <a href=${arxiv} class='arxiv' data-arxiv=${arxiv} target='_blank'>arXiv</a>
    <a href="javascript:void(0)" class ='local' data-url="${url}">Local</a></td>
    `
    return rowString

}

function misc_builder(data) {

    var title = (data.title? data.title:"Unavailable")

    var first = data.authors? data.authors[0]:"Unavailable"
    var autLen = Math.min(AUTCOUNT, data.authors.length)
    if (data.authors) {
        var autString = ''
        for (var i = 0; i < autLen; i++) {
            var author = data.authors[i].split(', ').reverse().join(' ')
            autString += author + ', '
        }
        autString = autString.substring(0, autString.length - 2)
        if (data.authors.length > autLen) {autString += " et al."}
    }
    else { autString = "Unavailable"}


    var journal = (data.pub.journal_title? data.pub.journal_title:"Unavailable")
    var pubString = (data.pub.journal_title?
     `${data.pub.journal_title? data.pub.journal_title:""}
      ${data.pub.journal_volume? data.pub.journal_volume:""}
      ${data.pub.page_start? data.pub.page_start:data.pub.artid? data.pub.artid:""}
      `:"Unavailable")

    var year = (data.pub.year? data.pub.year:'0000')
    var yearString = (data.pub.year? data.pub.year:'Unavailable')

    rowString = `
    <td data-sort=${title.toLowerCase()} class='title'>${title}</td>
    <td data-sort=${first.toLowerCase()} class='author'>${autString}</td>
    <td data-sort=${journal.toLowerCase()} class='journal'>${pubString}</td>
    <td data-sort=${year} class='year'>${yearString}</td>
    `
    return rowString

}

function ref_search(tableID, query) {
    var table,rows,row,hide,cells,arxiv = 0
    arxiv = document.querySelector('#hasArxiv').checked
    table = document.querySelector(tableID)
    rows = table.rows
    for (var i=1,j=rows.length; i<j; i++) {
        row = rows[i]
        cells = row.querySelectorAll('td')
        hide = true
        for (var k=0,l=cells.length; k<l; k++) {
            if (cells[k].innerText.toLowerCase().includes(query.toLowerCase())) {
                hide = false
            }
        }
        if (arxiv) {
            cell = row.querySelector('.arxiv')
            if (cell.dataset.arxiv == "Unavailable") {
                hide = true
            }
        }
        if (hide) {
            row.style.display = 'none'
        }
        else {
            row.style.display = ''
        }
    }
}
