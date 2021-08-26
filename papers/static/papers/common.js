function sort_table(tableID,n) {

    var table,switching,dir,rows,shouldSwitch,x,y,switchCount = 0

    table = document.querySelector(tableID)
    switching = true
    dir = "+"

    while (switching) {

        switching = false
        rows = table.rows

        for (i = 1; i < (rows.length - 1); i++) {

          shouldSwitch = false;
          x = rows[i].querySelectorAll('td')[n]
          y = rows[i+1].querySelectorAll('td')[n]

          if (dir == "+") {
            if (x.dataset.sort > y.dataset.sort) {
              shouldSwitch = true;
              break;
            }
          }
          else if (dir == "-") {
            if (x.dataset.sort < y.dataset.sort) {
              shouldSwitch = true;
              break;
            }
          }
        }

        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
          switchCount += 1
        }
        else {
          if (switchCount == 0 && dir == "+") {
              dir = "-";
              switching = true;
          }
        }
    }
}

function sort_table_n(tableID,n) {

    var table,switching,dir,rows,shouldSwitch,x,y,switchCount = 0

    table = document.querySelector(tableID)
    switching = true
    dir = "+"

    while (switching) {

        switching = false
        rows = table.rows

        for (i = 1; i < (rows.length - 1); i++) {

          shouldSwitch = false;
          x = rows[i].querySelectorAll('td')[n]
          y = rows[i+1].querySelectorAll('td')[n]

          if (dir == "+") {
            if (Number(x.dataset.sort) > Number(y.dataset.sort)) {
              shouldSwitch = true;
              break;
            }
          }
          else if (dir == "-") {
            if (Number(x.dataset.sort) < Number(y.dataset.sort)) {
              shouldSwitch = true;
              break;
            }
          }
        }

        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
          switchCount += 1
        }
        else {
          if (switchCount == 0 && dir == "+") {
              dir = "-";
              switching = true;
          }
        }
    }
}

function selectFunction(projectId, btn, url) {
    fetch('/papers/projectstatus', {
        method:'POST',
        body:JSON.stringify({'projectId':projectId,'url':url})
    })
    .then(response => response.json())
    .then(result => {
        if (result.status == 'True') {
            btn.innerHTML = 'Remove'
        }
        else if (result.status == 'False') {
            btn.innerHTML = 'Add'
        }
    })
}

function projectChange(projectId, btn, url) {
    let read_url = url
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
            if (btn.innerHTML == 'Add') {
                btn.innerHTML = 'Remove'
            }
            else if (btn.innerHTML == 'Remove') {
                btn.innerHTML = 'Add'
            }
        }
    })
}
