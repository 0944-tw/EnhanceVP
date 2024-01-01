// ==UserScript==
// @name         vPMod
// @namespace    http://tampermonkey.net/
// @version      2023-12-31
// @description  try to take over the world!
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
    jquery.src = "https://code.jquery.com/jquery-1.11.3.min.js";
    document.head.appendChild(jquery);
    // wait for jquery loaded
    console.log("JQuery Missing, Injected");
    await waitLoad(jquery);
    console.log("JQ Loaded");
    // add bootstrap.js
    let bootstrap = document.createElement("script");
    bootstrap.src =
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js";
    document.head.appendChild(bootstrap);
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

        `;
      let records = [];
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
      window.editdns = function(type) {
        console.log(type);
      }
      document.getElementById("dnsLoadingText").innerHTML = `Loading DNS Records.. Loaded ${records.length} DNS Records`;
      let table = document.getElementById("dns_lists")
      for (let i =0; i < records.length; i++) {
       // add item to table
       let record = records[i];
        let row =document.createElement("tr");
        let ttl = document.createElement("td");
        let name = document.createElement("td");
        let value = document.createElement("td");
        let type = document.createElement("td");
        let action = document.createElement("td");
        row.appendChild(name);
        row.appendChild(ttl);
        row.appendChild(type);
        row.appendChild(value);
        row.appendChild(action);
        ttl.innerText = "14400"
        name.innerHTML = record.domain || record.cnamerecord;
        value.innerHTML = record.html || record.destination || record.mxrecord || record.currentspfdata;
        type.innerHTML = records[i].type.toUpperCase();
        action.innerHTML = `
        <div class="btn btn-primary btn-outline" onclick="window.editdns('${type}')">Edit</div>
        <div class="btn btn-danger btn-outline" onclick="window.editdns('${type}')">Delete</div>
        `
        table.querySelector("tbody").appendChild(row);
      }
  }
})();
