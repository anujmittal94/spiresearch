const AUTCOUNT = 3

document.addEventListener('DOMContentLoaded', function() {

//Get main paper url api
let url = url_to_api(document.querySelector('#paperUrl').innerHTML)

//Get readlist from page and update button
    if (document.querySelector('#readlist')) {
        var readlist = document.querySelector('#readlist').innerHTML
        if (readlist.includes(api_to_url(url))) {
            document.querySelector('#read').innerHTML = 'Remove from Readlist'
        }
        else {
            document.querySelector('#read').innerHTML = 'Add to Readlist'
        }
    }

//Searched Paper Information//

    //Fetch paper information
    api_search(url,{fields:['titles', 'authors', 'publication_info',
     'abstracts', 'citation_count', 'arxiv_eprints', 'references']})
    .then(data => {
        let info = paper_info(data)

        //Place paper information into DOM
        document.querySelector('#title').innerHTML =
         (info.title? info.title:"Title Unavailable")

        //Author information with hide and show authors above AUTCOUNT
        if (info.authors) {
            let autLen = Math.min(AUTCOUNT, info.authors.length)
            let autString = ''
            for (var i = 0; i < autLen; i++) {
                let author = info.authors[i].split(', ').reverse().join(' ')
                autString += author + ', '
            }
            document.querySelector('#authors').innerHTML +=
             autString.substring(0, autString.length - 2)
            if (info.authors.length > autLen) {
                let autString= ''
                for (var i = autLen, j = info.authors.length; i < j; i++) {
                    author = info.authors[i].split(', ').reverse().join(' ')
                    autString += author + ', '
                }
                document.querySelector('#authors').innerHTML +=
                 `<span id="hiddenAut"></span>`
                document.querySelector('#hiddenAut').style.display = 'none'
                document.querySelector('#hiddenAut').innerHTML += ', '
                 + autString.substring(0, autString.length - 2)
                let btn = document.createElement("button");
                btn.setAttribute('class', 'btn btn-outline-primary')
                btn.innerHTML = `Show All (${info.authors.length})`
                document.querySelector('#authors').appendChild(btn)
                btn.onclick = function () {
                    if(document.querySelector('#hiddenAut').style.display == 'none') {
                        document.querySelector('#hiddenAut').style.display = 'inline'
                        btn.innerHTML = `Hide`
                    }
                    else {
                        document.querySelector('#hiddenAut').style.display = 'none'
                        btn.innerHTML = `Show All (${info.authors.length})`
                    }
                }
            }
        }
        else {
            document.querySelector('#authors').innerHTML += "Authors Not Available"
        }

        document.querySelector('#abstract').innerHTML = (info.abstract?
        `Source: ${info.abstract.source? info.abstract.source:"Unavailable"}
        <br>${info.abstract.value}`:"Abstract Unavailable")


        document.querySelector('#pub').innerHTML = (info.pub?
          `${info.pub.journal_title? info.pub.journal_title:""}
           ${info.pub.journal_volume? info.pub.journal_volume:""}
           ${info.pub.page_start? info.pub.page_start:info.pub.artid? info.pub.artid:""}
           ${info.pub.year? info.pub.year:""}`:
          "Unavailable")

        document.querySelector('#citations').innerHTML = (info.citations?
         `Citations: ${info.citations}`:"Citations: 0")

        inspire_link = api_to_url(url)
        document.querySelector('#links').innerHTML = `
        <a href=${inspire_link} class ='inspire' data-url=${inspire_link}
        target='_blank'>INSPIRE</a>
        `

        arxiv_link = info.arxiv? "https://arxiv.org/abs/"+info.arxiv:false
        if (arxiv_link) {
            document.querySelector('#links').innerHTML += `
             <a href=${arxiv_link} class ='inspire' data-url=${arxiv_link}
            target='_blank'>arXiv</a>
            `
        }

//References Information//
        //Set up tables
        let inspireTable = document.createElement("table")
        inspireTable.setAttribute("class", "table table-sm")
        inspireTable.setAttribute("id", "inspireTable")
        let inspireHead = document.createElement("thead")
        let inspireRows = document.createElement("tbody")
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
        `
        //Add columns for readlist and projects
        if (document.querySelector('#readlist')) {
            inspireHeadRow.innerHTML += `<th>Readlist</th>`
        }
        if (document.querySelector('#projects')) {
            inspireHeadRow.innerHTML += `<th>Projects</th>`
        }

        inspireHead.appendChild(inspireHeadRow)
        inspireTable.appendChild(inspireHead)


        let miscTable = document.createElement("table")
        miscTable.setAttribute("class", "table table-sm")
        miscTable.setAttribute("id", "miscTable")
        let miscHead = document.createElement("thead")
        let miscRows = document.createElement("tbody")
        let miscHeadRow = document.createElement("tr");
        miscHeadRow.innerHTML = `
        <th>Title
        <i onclick = 'sort_table("#miscTable",0)'class="fas fa-sort"></i>
        </th>
        <th>Author
        <i onclick = 'sort_table("#miscTable",1)'class="fas fa-sort"></i>
        </th>
        <th>Publication
        <i onclick = 'sort_table("#miscTable",2)'class="fas fa-sort"></i>
        </th>
        <th>Year
        <i onclick = 'sort_table_n("#miscTable",3)'class="fas fa-sort"></i>
        </th>
        `
        miscHead.appendChild(miscHeadRow)
        miscTable.appendChild(miscHead)

        //Build table rows
        for (var i=0, j=info.references.length; i<j; i++) {
            let ref = info.references[i]
            if (ref.record) {
                let refUrl = ref.record.$ref
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
                    if (document.querySelector('#readlist'))  {
                        if (readlist.includes(api_to_url(refUrl))) {
                            row.innerHTML +=
                            `<td><button type="button" data-url=${api_to_url(refUrl)} class="read btn btn-primary">Remove</button></td>`
                        }
                        else {
                            row.innerHTML +=
                            `<td><button type="button" data-url=${api_to_url(refUrl)} class="read btn btn-primary">Add</button></td>`
                        }
                    }

                    // Project row button
                    if (document.querySelector('#projects')) {
                        row.innerHTML += `
                        <td>
                            <div class="input-group p-0 flex-row">
                                <select class="form-select projectSelect">
                                  ${document.querySelector('#projectSelect').innerHTML}
                                </select>
                                <button class="btn btn-primary projectSelectBtn" type="button">Add</button>
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


                    if (document.querySelector('#readlist')) {
                        //Read button functionality
                        row.querySelector('.read').onclick = function () {
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
                                    if (this.innerHTML == "Remove") {
                                        this.innerHTML = "Add"
                                    }
                                    else {
                                        this.innerHTML = "Remove"
                                    }
                                }
                            })
                        }
                    }


                    if (document.querySelector('#projects')) {
                        //Project button functionality
                        row.querySelector('.projectSelect').onchange = function () {
                            let projectId = row.querySelector('.projectSelect').value
                            let btn = row.querySelector('.projectSelectBtn')
                            let currentUrl = api_to_url(refUrl)
                            if (projectId != '0') {
                                selectFunction(projectId,btn,currentUrl)
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
            else {
                var refInfo = misc_info(ref.reference)
                let row = document.createElement('tr')
                row.innerHTML = misc_builder(refInfo)
                miscRows.appendChild(row)
            }
        }
        //Append built rows to table and add to DOM
        inspireTable.appendChild(inspireRows)
        document.querySelector('#inspireRecords').appendChild(inspireTable)
        miscTable.appendChild(miscRows)
        document.querySelector('#miscRecords').appendChild(miscTable)
    })

    //Search functionality
    document.querySelector('#inspireSearch').oninput = function () {
        ref_search("#inspireTable",document.querySelector('#inspireSearch').value)
    }

    document.querySelector('#miscSearch').oninput = function () {
        ref_search("#miscTable",document.querySelector('#miscSearch').value)
    }

    document.querySelector('#hasArxiv').onclick = function () {
        ref_search("#inspireTable",document.querySelector('#inspireSearch').value)
    }

    //Readlist functionality for main paper
    if (document.querySelector('#readlist')) {
        document.querySelector('#read').onclick = function () {
            let read_url = api_to_url(url)
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
                    if (this.innerHTML == "Remove from Readlist") {
                        this.innerHTML = "Add to Readlist"
                    }
                    else {
                        this.innerHTML = "Remove from Readlist"
                    }
                }
            })
        }
    }

    //Project functionality for main paper
    if (document.querySelector('#projects')) {
        document.querySelector('#projectSelect').onchange = function () {
            let projectId = document.querySelector('#projectSelect').value
            let btn = document.querySelector('#projectSelectBtn')
            let currentUrl = api_to_url(url)
            if (projectId != '0') {
                selectFunction(projectId,btn,currentUrl)
            }

        }

        document.querySelector('#projectSelectBtn').onclick = function () {
            let projectId = document.querySelector('#projectSelect').value
            let btn = document.querySelector('#projectSelectBtn')
            let currentUrl = api_to_url(url)
            if (projectId != '0') {
                projectChange(projectId,btn,currentUrl)
            }
        }
    }
})
