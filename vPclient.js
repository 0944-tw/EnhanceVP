function getPage(url) {
  return new Promise((resolve) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      resolve(new DOMParser().parseFromString(xhr.responseText, "text/html"));
    };
    xhr.send();
  });
}

let token = document
  .getElementById("lnkUserPrefUpdateContactInfo")
  .href.split("&ttt=")[1];
console.log(token);
// table to json function
function tableToJson(table) {
  var headers = [];
  var data = [];

  // Get headers
  for (var i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].innerText
      .toLowerCase()
      .replace(/ /gi, "")
      .replace("\n", "")
      .replace("\t", "");
  }

  // Get data
  for (var i = 1; i < table.rows.length; i++) {
    var rowData = {};
    for (var j = 0; j < table.rows[i].cells.length; j++) {
      rowData[headers[j]] = table.rows[i].cells[j].innerText
        .replace("\n", "")
        .replace("\t", "");
    }
    data.push(rowData);
  }

  return data;
}

let cname = {
  remove: async (domain) => {
    let page = await getPage(
      `/panel/indexpl.php?option=cnamerecords&ttt=${token}`
    );
    let jsons = tableToJson(page.querySelectorAll("#sql_db_tbl")[1]);
    for (let i = 0; i < jsons.length; i++) {
      let row = jsons[i];
      console.log(row);
      if (row.cnamerecord == domain) {
        let rowElement = page
          .querySelectorAll("#sql_db_tbl")[1]
          .getElementsByTagName("tr")[i + 1];
        let btn = rowElement.querySelector(".btn").href;
        await getPage(btn);

        return true;
      } else {
        continue;
      }
    }
  },
  add: async (domain, destination) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "modules-new/cnamerecords/add.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let domainName = domain.slice(0, -1);
    domainName = domainName.split(".").slice(1).join(".");
    xhr.send(
      `source=${
        domain.split(".")[0]
      }&d_name=${domainName}&destination=${destination}&B1=Add`
    );
  },
  list: async () => {
    let records = [];
    let cnameHtml = await getPage(
      `/panel/indexpl.php?option=cnamerecords&ttt=${token}`
    );
    let cnameRecordTable = cnameHtml.querySelectorAll("#sql_db_tbl")[1];
    let cnameHtmlJson = tableToJson(cnameRecordTable);
    for (let i = 1; i < cnameHtmlJson.length; i++) {
      var row = cnameHtmlJson[i];
      if (row == {}) continue;
      console.log(row);
      row["type"] = "cname";
      records.push(row);
    }
    return records;
  },
};

let spf = {
  domains: async () => {
    let page = await getPage(
      `/panel/indexpl.php?option=spfrecords&ttt=${token}`
    );
    let domains = [];
    for (
      let i = 0;
      i < page.getElementsByName("d_name")[0].options.length;
      i++
    ) {
      let option = page.getElementsByName("d_name")[0].options[i];
      domains.push(option.value);
    }
    return domains;
  },
  add: async (domain, source) => {
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "modules-new/spfrecords/add.php");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = () => {
        if (xhr.responseText.includes("alert alert-danger")) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      xhr.send(
        new URLSearchParams({
          Data: source,
          d_name: domain,
          B1: "Add",
        }).toString()
      );
    });
  },
  remove: async (domain, spfdata) => {
    return new Promise(async (resolve) => {
      let result = await getPage(
        "/panel/indexpl.php?option=spfrecords&ttt=" + token
      );
      let table = result.querySelectorAll("#sql_db_tbl")[1];
      let jsons = tableToJson(table);
      let deleteHref = "";
      for (let i = 0; i < jsons.length; i++) {
        let row = jsons[i];
        if (row.domain == domain && row.currentspfdata == spfdata) {
          let rowElement = table.getElementsByTagName("tr")[i + 1];
          let btn = rowElement.querySelector(".btn").href;
          deleteHref = btn;
        } else {
          continue;
        }
      }
      if (!deleteHref) resolve(false);
      let deleteResult = await getPage(deleteHref);
      if (deleteResult.querySelector(".alert-error")) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  },
  list: async () => {
    let records = [];
    let spfRecordTable = spfRecordHtml.querySelectorAll("#sql_db_tbl")[1];
    let spfJson = tableToJson(spfRecordTable);

    for (let i = 1; i < spfJson.length; i++) {
      var row = spfJson[i];
      if (row == {}) continue;
      console.log(row);
      row["type"] = "spf";
      records.push(row);
    }
    return records;
  },
};
let mx = {
    list: async() => {
        let mxh5 = await getPage(
            `/panel/indexpl.php?option=mxrecords&ttt=${token}`
          );
          let mxh5table = mxh5.querySelectorAll("#sql_db_tbl")[1];
          let mxh5tableJson = tableToJson(mxh5table);
          for (let i = 1; i < mxh5tableJson.length; i++) {
            var row = mxh5tableJson[i];
            if (row == {}) continue;
            console.log(row);
            row["type"] = "mx";
            row["html"] = `
            <b>Priority</b>: ${row.priority} <br>
            <b>Destination</b>: ${row.mxrecord}
            `
            records.push(row);
          }
    }
};
