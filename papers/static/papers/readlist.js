const AUTCOUNT = 3

document.addEventListener('DOMContentLoaded', function() {
    //Check for empty readlist
    if (document.querySelector('#readlist')) {
        //Set up table
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

        //Build table rows
        readlist = document.querySelector('#readlist').innerHTML.split(',')
        for (var i=0, j=readlist.length;i<j;i++){
            let refUrl = url_to_api(readlist[i])
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
                row.innerHTML +=
                `<td><button type="button" data-url=${api_to_url(refUrl)} class="remove btn btn-primary">Remove</button></td>`


                // Project row button
                if (document.querySelector('#projects')) {
                    row.innerHTML += `
                    <td>
                        <div class="input-group p-0 flex-row">
                            <select class="form-select projectSelect">
                              ${document.querySelector('#projectSelect').innerHTML}
                            </select>
                            <button class="btn btn-primary projectSelectBtn" type="button" disabled>Select</button>
                        </div>
                    </td>`
                }

                row.querySelector('.local').onclick = function () {
                    document.querySelector("#id_paper_url").value = this.dataset.url
                    document.querySelector("#refForm").submit()
                }
                if (row.querySelector('.arxiv').dataset.arxiv == 'Unavailable') {
                    row.querySelector('.arxiv').style.display = 'none'
                }

                //Read button functionality
                row.querySelector('.remove').onclick = function () {
                    let read_url = this.dataset.url
                    fetch('read', {
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


                if (document.querySelector('#projects')) {
                    //Project button functionality
                    row.querySelector('.projectSelect').onchange = function () {
                        let projectId = row.querySelector('.projectSelect').value
                        let btn = row.querySelector('.projectSelectBtn')
                        let currentUrl = api_to_url(refUrl)
                        if (projectId != '0') {
                            btn.disabled = false
                            selectFunction(projectId,btn,currentUrl)
                        }
                        else {
                            btn.innerHTML = 'Select'
                            btn.disabled = true
                        }
                    }
                    row.querySelector('.projectSelectBtn').onclick = function () {
                        let projectId = row.querySelector('.projectSelect').value
                        let btn = row.querySelector('.projectSelectBtn')
                        let currentUrl = api_to_url(refUrl)
                        if (projectId != '0') {
                            projectChange(projectId,btn,currentUrl)
                        }
                    }
                }
            })
            inspireRows.appendChild(row)
        }
        //Append built rows to table and add to DOM
        inspireTable.appendChild(inspireRows)
        document.querySelector('#inspireRecords').appendChild(inspireTable)

    }
    else {
        document.querySelector('#inspireRecords').innerHTML = `
        No papers being read`
    }

    //Search functionality
    document.querySelector('#inspireSearch').oninput = function () {
        ref_search("#inspireTable",document.querySelector('#inspireSearch').value)
    }

    document.querySelector('#hasArxiv').onclick = function () {
        ref_search("#inspireTable",document.querySelector('#inspireSearch').value)
    }
})
