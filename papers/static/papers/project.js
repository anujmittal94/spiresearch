const AUTCOUNT = 3

document.addEventListener('DOMContentLoaded', function() {
    let projectId = document.querySelector('#projectId').innerHTML
    let readlist = document.querySelector('#readlist').innerHTML
    if (document.querySelector('#projectlist')) {

        let inspireTable = document.createElement("table")
        inspireTable.setAttribute("class", "table table-sm")
        inspireTable.setAttribute("id", "inspireTable")
        let inspireHead = document.createElement("thead")
        let inspireRows = document.createElement('tbody')
        let inspireHeadRow = document.createElement("tr")
        inspireHeadRow.innerHTML = `
        <th>Title
        <i onclick = 'sort_table("#inspireTable",0)'class="fas fa-sort"></i>
        </th>
        <th>Author
        <i onclick = 'sort_table("#inspireTable",1)'class="fas fa-sort"></i>
        </th>
        <th>Publication
        <i onclick = 'sort_table("#inspireTable",2)'class="fas fa-sort"></i>
        </th>
        <th>Year
        <i onclick = 'sort_table_n("#inspireTable",3)'class="fas fa-sort"></i>
        </th>
        <th>Citations
        <i onclick = 'sort_table_n("#inspireTable",4)'class="fas fa-sort"></i>
        </th>
        <th>Links</th>
        <th>Readlist</th>
        <th>Projects</th>
        `
        inspireHead.appendChild(inspireHeadRow)
        inspireTable.appendChild(inspireHead)

        urls = document.querySelector('#projectlist').innerHTML.split(',')
        for (var i=0, j=urls.length;i<j;i++){
            let refUrl = url_to_api(urls[i])
            let row = document.createElement('tr')
            api_search(refUrl,{fields:['titles', 'authors', 'publication_info',
             'citation_count', 'arxiv_eprints']})
            .then(data => {
                let refInfo = paper_info(data)
                refInfo['url'] = refUrl
                row.innerHTML = rec_builder(refInfo)
            })
            .then(data => {

                //Read row button
                if (readlist.includes(api_to_url(refUrl))) {
                    row.innerHTML +=
                    `<td><button type="button" data-url=${api_to_url(refUrl)} class="read btn btn-primary">Remove</button></td>`
                }
                else {
                    row.innerHTML +=
                    `<td><button type="button" data-url=${api_to_url(refUrl)} class="read btn btn-primary">Add</button></td>`
                }


                row.innerHTML +=
                `<td><button type="button" data-url=${api_to_url(refUrl)} class="remove btn btn-primary">
                Remove</button></td>`

                row.querySelector('.local').onclick = function () {
                    document.querySelector("#id_paper_url").value = this.dataset.url
                    document.querySelector("#refForm").submit()
                }

                if (row.querySelector('.arxiv').dataset.arxiv == 'Unavailable') {
                    row.querySelector('.arxiv').style.display = 'none'
                }

                //Read button functionality
                row.querySelector('.read').onclick = function () {
                    let read_url = this.dataset.url
                    fetch('/papers/read', {
                        method:'PUT',
                        body:JSON.stringify({read_url})
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.error) {
                            console.log(result.error)
                        }
                        else {
                            console.log(result.message)
                            if (this.innerHTML == "Remove") {
                                this.innerHTML = "Add"
                            }
                            else {
                                this.innerHTML = "Remove"
                            }
                        }
                    })
                }


                row.querySelector('.remove').onclick = function () {
                    let read_url = api_to_url(this.dataset.url)
                    fetch('/papers/readproject/'+projectId, {
                        method:'PUT',
                        body:JSON.stringify({read_url})
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.error) {
                            console.log(result.error)
                        }
                        else {
                            console.log(result.message)
                            row.setAttribute("class","removed")
                        }
                    })
                }
            })
            inspireRows.appendChild(row)
        }
        inspireTable.appendChild(inspireRows)
        document.querySelector('#inspireRecords').appendChild(inspireTable)

    }
    else {
        document.querySelector('#inspireRecords').innerHTML = `
        No papers being read`
    }

    document.querySelector('#inspireSearch').oninput = function () {
        ref_search("#inspireTable",document.querySelector('#inspireSearch').value)
    }

    document.querySelector('#hasArxiv').onclick = function () {
        ref_search("#inspireTable",document.querySelector('#inspireSearch').value)
    }
})
