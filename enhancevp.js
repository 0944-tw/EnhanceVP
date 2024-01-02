// ==UserScript==
// @name         Enhance VP
// @namespace    https://github.com/ImLoadingUuU/EnhanceVP
// @version      2023-12-31
// @description  Enhance VP 
// @author       You
// @match        *://cpanel.infinityfree.com/panel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infinityfree.com
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";
  // add bootstrap.js loader
  // check bootstrap.js exists
  function waitLoad(element) {
    return new Promise((resolve) => {
      element.onload = resolve;
    });
  }

  // jquery
  //check variable $ exists
  function wait(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
  // inject style
  let style = document.createElement("style");
  style.innerHTML = `
  #content {

    padding: 0 24px;
  }
 `
  document.head.appendChild(style);
  wait(1000);
  if (document.URL.includes("option=")) {
    let jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.0.min.js";
    document.head.appendChild(jquery);
    // wait for jquery loaded
    console.log("JQuery Missing, Injected");
    await waitLoad(jquery);
    console.log("JQ Loaded");
    // add bootstrap.js
    let bootstrap = document.createElement("script");
    bootstrap.src =
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js";
    document.head.appendChild(bootstrap);
    await waitLoad(bootstrap);
    let loadvPc = document.createElement("script");
    loadvPc.src =
      "https://raw.rawgit.net/ImLoadingUuU/EnhanceVP/main/vPclient.js";
    document.head.appendChild(loadvPc);
    await waitLoad(loadvPc);
  } else {
    console.log("JQuery Exists");
  }
  // get token
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
  // vPanel Functions
  let removeCname =async (domain) => {
  let page= await getPage(`/panel/indexpl.php?option=cnamerecords&ttt=${token}`)
  let jsons = tableToJson(page.querySelectorAll("#sql_db_tbl")[1])
  for (let i =0; i < jsons.length; i++) {
    let row = jsons[i]
    console.log(row)
    if (row.cnamerecord == domain) {
      let rowElement = page.querySelectorAll("#sql_db_tbl")[1].getElementsByTagName("tr")[i+1]
      let btn = rowElement.querySelector(".btn").href
      await getPage(btn)
       
     
      return true
    } else {
      continue
    }
  }
  }
  let addCname = async(domain,destination) => {
   let xhr = new XMLHttpRequest();
   xhr.open("POST","modules-new/cnamerecords/add.php")
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    let domainName = domain.slice(0,-1)
    domainName = domainName.split('.').slice(1).join(".")
    xhr.send(`source=${domain.split(".")[0]}&d_name=${domainName}&destination=${destination}&B1=Add`)
  }
  let getSpfDomains = async() => {
    let page = await getPage(`/panel/indexpl.php?option=spfrecords&ttt=${token}`)
    let domains = []
    for (let i = 0; i< page.getElementsByName("d_name")[0].options.length; i++) {
      let option = page.getElementsByName("d_name")[0].options[i]
      domains.push(option.value)
    }
    return domains
  }
  let addSpf = async(domain,source) => {
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST","modules-new/spfrecords/add.php")
       xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
        xhr.onload = () => {
          if (xhr.responseText.includes("alert alert-danger")) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
       xhr.send(new URLSearchParams({
        Data: source,
        d_name: domain,
        B1: "Add" 
      }).toString())
    })
  }
  // 
  console.log("Enhance vP 1.0");
  let titlePrefix = "cPanel - ";
  let titles = {
    Home: "Home",
    Accountsettings: "Account Settings",
    Protectedfolders: "Directory Privacy",
    Ftpclients: "FTP Clients",
    Mysql: "MySQL",
    Nodatabase: "Database Missing",
    Remotemysql: "Remote MySQL",
    Domains: "Domains",
    Subdomains: "Subdomains",
    Parked: "Parked Domains",
    Redirect: "Redirect Domains",
    Mxrecords: "MX Records",
    Spfrecords: "SPF Records",
    Deny_ip: "Blocked IP",
    Stats2: "Stats",
    Stats: "Stats",
    Ssl: "SSL",
    Cnamerecords: "CNAME",
    Cron: "Cron Job",
    Errorpages: "Error Pages",
    Phpconfig: "PHP Info",
    Gettingstarted: "Get Started",
    Backup: "Backup",
  };
  document.title = titlePrefix + (titles[document.title] || document.title);
  let navbars = document.getElementsByClassName("navbar-header")[0];
  document
    .getElementById("btnSideBarToggle")
    .setAttribute("data-toggle", "collapse");
  document
    .getElementById("btnSideBarToggle")
    .setAttribute("data-target", "#navbar");
    //
  let navbarMod = `<div id="navbar" class="collapse navbar-collapse" aria-expanded="true"   id="navbar">
              <ul class="nav navbar-nav">
                <li class=""><a href="/panel/indexpl.php?"></a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Upgrade</a></li>
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Domains <span class="caret"></span></a>
                  <ul class="dropdown-menu">
                    <li role="separator" class="divider"></li>
                   <li class="dropdown-header">DNS</li>
                    <li><a href="/panel/indexpl.php?option=mxrecords">MX</a></li>
                    <li><a href="/panel/indexpl.php?option=cnamerecords">CNAME</a></li>
                    <li><a href="/panel/indexpl.php?option=spfrecords">SPF</a></li>
                    <li role="separator" class="divider"></li>
                    <li class="dropdown-header">Domains</li>
                    <li><a href="/panel/indexpl.php?option=domains&ttt=${token}">Add new</a></li>
                    <li><a href="/panel/indexpl.php?option=subdomains&ttt=${token}">Create Subdomain</a></li>
                  </ul>
                </li>
              </ul>

            </div>
      `;
  // navbars.innerHTML += navbarMod;
  // Your code here...
  const option = document.URL.split("?")[1];
  let options = [];
  if (option) {
    options = option.split("&");
  }
  switch (options[0]) {
    case "option=nodatabase":
      document.getElementById("content").innerHTML = `
        <div class="body-content">



            <h1 class="page-header">
            <span id="icon-php_my_admin" class="page-icon icon-php_my_admin"></span>
            <span id="pageHeading">phpMyAdmin</span>

        </h1>

<p><i>Manage the data within your database easily using the industry standard phpMyAdmin tool, simply connect to your database below</i>:


  <br><br>
</p>
<div class="alert alert-warning">
<span class="glyphicon glyphicon-exclamation-sign"></span>
<div class="alert-message">No Database Exists</div>
</div>

<br><br><br>Want faster MySQL? All premium accounts have faster mysql and upto 8000MB of mysql storage.<br>View the premium vPanel demo by <a class="btn btn-info" href="http://ifastnet.com/cpanelpreview2.php" target="_blank"> Clicking Here</a><br>
<br>
Free domains are included with most plans including .COM, .NET, .ORG and .INFO<br><br>
<a class="transition" href="/panel/indexpl.php?option=upgrade" target="_blank">(Paid
accounts have unlimited installs) Prices starting at only $3.99 per
month</a>
Find out more about Premium Hosting today!

</div>

`;
      return;
    case "option=cron":
      document.getElementById("content").innerHTML = `
<div class="body-content">



    <h1 class="page-header">

    <span id="pageHeading">Cron Job</span>

</h1>

<p><i>Cron jobs allow you to automate certain commands or scripts on your site. You can set a command or script to run at a specific time every day, week, etc. For example, you could set a cron job to delete temporary files every week to free up disk space.</i>:


<br><br>
</p>
<div class="alert alert-warning">
<span class="glyphicon glyphicon-exclamation-sign"></span>
<div class="alert-message">Cron Job is Deprecated in Free Hosting.</div>
</div>

<br><br><br>Want Cron Job Feature?? All premium accounts have faster mysql and upto 8000MB of mysql storage.<br>View the premium vPanel demo by <a class="btn btn-info" href="http://ifastnet.com/cpanelpreview2.php" target="_blank"> Clicking Here</a><br>
<br>
Free domains are included with most plans including .COM, .NET, .ORG and .INFO<br><br>
<a class="transition" href="/panel/indexpl.php?option=upgrade" target="_blank">(Paid
accounts have unlimited installs) Prices starting at only $3.99 per
month</a>
Find out more about Premium Hosting today!

</div>

`;
      return;
    case "option=spfrecords":
      document.getElementById("pageHeading").innerHTML = `SPF Records`;
      return;
    case "option=cnamerecords":
      document.getElementById("content").innerHTML = `
        <div class="row"></div>
        <h1 class="page-header">
        <span id="icon-simple_zone_editor" class="page-icon icon-simple_zone_editor"></span>
        <span id="pageHeading">DNS</span>
    </h1>
    <p>
  <button type="button" class="btn btn-primary btn-xs" onclick="window.adddns('CNAME')">Add CNAME Record</button>
  <button type="button" class="btn btn-default btn-xs" onclick="window.adddns('SPF')">Add SPF</button>
</p>
    <p><i>Manage your DNS records easily using the industry standard cPanel tool, simply connect to your domain below</i>:
    <div class="alert alert-warning">
    <span class="glyphicon glyphicon-exclamation-sign"></span>
    <div class="alert-message" id="dnsLoadingText">Loading DNS Records.. Loaded 0 DNS Records</div>
    </div>

     <table id="dns_lists" class="table table-striped" style="width: 70%" border="0" cellpadding="2" cellspacing="2">
     <tbody>


       <tr>
       <th class="cell" style=" text-align: left;">Name
       </th><th class="cell" style="  text-align: left;">TTL
       </th> <th class="cell" style=" text-align: left;">Type
             </th><th class="cell" style="  text-align: left;">Record
             </th>
             <th class="cell" style="  text-align: left;">Actions
       </th></tr>
            <tr></tr>


         </tbody></table>
         <div class="modal fade" id="editrecordmodal" tabindex="-1" role="dialog">
         <div class="modal-dialog modal-sm" role="document">
           <div class="modal-content">
             <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
               <h4 class="modal-title">Edit DNS Record</h4>
             </div>
             <div class="modal-body" id="modalBody">
               <p>Queencard,Im hot</p>
             </div>
             <div class="modal-footer">
               <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
               <button type="button" class="btn btn-primary" id="applyDns">Apply</button>
             </div>
           </div><!-- /.modal-content -->
         </div><!-- /.modal-dialog -->
       </div>

       <!-- Add Record -->
       <div class="modal fade" id="addrecordmodal" tabindex="-1" role="dialog">
       <div class="modal-dialog" role="document">
         <div class="modal-content">
           <div class="modal-header">
             <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
             <h4 class="modal-title" id="myModalLabel">Add New Record</h4>
           </div>
           <div class="modal-body" id="recordModalBody">
             ...
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
             <button type="button" class="btn btn-primary" id="ModalAddRecord">Add</button>
           </div>
         </div>
       </div>
     </div>
        `;
      let records = [];
      let currentlyEditInfo = {
        type: "",
        name: "",
        value: "",
      }
      let currentlyAddInfo = {
        type: "",
        name: "",
        value: "",
      }
      let spfRecordHtml = await getPage(
        `/panel/indexpl.php?option=spfrecords&ttt=${token}`
      );
      let spfRecordTable = spfRecordHtml.querySelectorAll("#sql_db_tbl")[1];
      let spfJson = tableToJson(spfRecordTable);
      console.log("SPF:");
      console.log(spfJson);
      for (let i = 1; i < spfJson.length; i++) {
        var row = spfJson[i];
        if (row == {}) continue;
        console.log(row);
        row["type"] = "spf";
        records.push(row);
      }

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
      window.editdns = function(type,name,value) {
        $("#editrecordmodal").modal("show")
        console.log(type)
        currentlyEditInfo.type = type;
        currentlyEditInfo.name = name;
        currentlyEditInfo.value = value;
        if (type == "CNAME") {
          $("#modalBody").html(`
          <div class="form-group">
          <label for="recipient-name" class="control-label">Edit to</label>
          <input type="text" class="form-control" placeholder='${value}' id="newValue">
        </div>
          `)
        }
      }
      window.removedns = function(type,domain) {
      
        if (type == "CNAME") {
          console.log(`Remove CNAME ${domain} `)
          removeCname(domain)
        }
      }
      window.adddns =async function(type) {
        $("#addrecordmodal").modal("show");
        if (type == "CNAME") {
          currentlyAddInfo.type = type;
         $("#recordModalBody").html(`
         <div class="form-group">
           <label for="recipient-name" class="control-label">Source</label>
           <input type="text" class="form-control" placeholder='Enter Data There' id="source">
         </div>
         <div class="form-group">
           <label for="recipient-name" class="control-label">Destination</label>
           <input type="text" class="form-control" placeholder='Enter Data There' id="destination">
         </div>
         `)
        } else if (type == "SPF") {
         let data= await getSpfDomains()
          console.log(data)
          currentlyAddInfo.type = type;
          $("#recordModalBody").html(`
          <div class="form-group">
            <label for="recipient-name" class="control-label">Domain</label>
            <select id="domain" class="form-control">

            </select>
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">Source</label>
            <input type="text" class="form-control" placeholder='Source' id="source">
          </div>
          `)
          for (let i = 0; i < data.length; i++) {
            $('#domain').append($('<option>', {
              value: data[i],
              text: data[i]
          }));
          }
        }
      }
      document.getElementById("dnsLoadingText").innerHTML = `Loading DNS Records.. Loaded ${records.length} DNS Records`;
      document.getElementById("applyDns").onclick = async function() {
        console.log("Apply DNS")
        if( currentlyEditInfo.type == "CNAME") {
          $("#applyDns").html("Applying..")
          // disable
          $("#applyDns").attr("disabled",true)
          if(!document.getElementById("newValue").value) {
            $("#applyDns").html("Please enter new value")
            return
          }
          await removeCname(currentlyEditInfo.name)
          await addCname(currentlyEditInfo.name,document.getElementById("newValue").value)
          $("#applyDns").html("Applied")
          await wait(1000)
          // refresh page

          window.location.reload()
        }  
      }
      document.getElementById("ModalAddRecord").onclick = async function(){
        $("#ModalAddRecord").attr("disabled",true)
       if(currentlyAddInfo.type == "CNAME") {
           await addCname($("#source").val() + ".",$("#destination").val())
       }else if (currentlyAddInfo.type == "SPF") {
       let res = await  addSpf($("#domain").val(),$("#source").val())
       if (res) {
         window.location.reload()
       } else {
         $("#ModalAddRecord").html("Error")
         
       }
       await wait(3000)
       $("#ModalAddRecord").attr("disabled",false)
        $("#ModalAddRecord").html("Add")
    }
      }
      let table = document.getElementById("dns_lists")
      for (let i =0; i < records.length; i++) {
       // add item to table
       let recordType =  records[i].type.toUpperCase();
       let name = records[i].domain || records[i].cnamerecord;
        
       let record = records[i];
       let value =  record.html || record.destination || record.mxrecord || record.currentspfdata; 
       let row =document.createElement("tr");
        let ttl = document.createElement("td");
        let nameTd = document.createElement("td");
        let valueTd = document.createElement("td");
        let type = document.createElement("td");
        let action = document.createElement("td");
        row.appendChild(nameTd);
        row.appendChild(ttl);
        row.appendChild(type);
        row.appendChild(valueTd);
        row.appendChild(action);
        ttl.innerText = "14400"
        nameTd.innerHTML = record.domain || record.cnamerecord;
        valueTd.innerHTML = value;
        type.innerHTML = records[i].type.toUpperCase();
        action.innerHTML = `
        <div class="btn btn-primary btn-outline" onclick="window.editdns('${recordType}','${name}','${value}')">Edit</div>
        <div class="btn btn-danger btn-outline" onclick="window.removedns('${recordType}','${name}')">Delete</div>
        `
        table.querySelector("tbody").appendChild(row);
      }
  }
})();
