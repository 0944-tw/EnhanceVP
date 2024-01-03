(async () => {
  document.getElementById("content").innerHTML = `
<div class="row"></div>
<h1 class="page-header">
<span id="icon-simple_zone_editor" class="page-icon icon-simple_zone_editor"></span>
<span id="pageHeading">DNS</span>
</h1>
<p>
<button type="button" class="btn btn-primary btn-xs" onclick="document.adddns('CNAME')">Add CNAME Record</button>
<button type="button" class="btn btn-default btn-xs" onclick="document.adddns('SPF')">Add SPF</button>
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
     <div class="alert alert-danger" id="editRecordError" hidden>
<span class="glyphicon glyphicon-exclamation-sign"></span>
<div class="alert-message" id="editRecordErrorText">Error Here</div>
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
  };
  let currentlyAddInfo = {
    type: "",
    name: "",
    value: "",
  };

  let spfrecords = await vpapi.spf.list();
  for (let i = 0; i < spfrecords.length; i++) {
    records.push(spfrecords[i]);
  }
  let mxrecords = await vpapi.mx.list();
  console.log(mxrecords);
  for (let i = 0; i < mxrecords.length; i++) {
    records.push(mxrecords[i]);
  }
  let cnamerecords = await vpapi.cname.list();
  for (let i = 0; i < cnamerecords.length; i++) {
    records.push(cnamerecords[i]);
  }
  console.log(records);
  document.editdns = function (type, name, value) {
    $("#editrecordmodal").modal("show");
    console.log(type);
    console.log(value)
      value = unescape(value)

     
    currentlyEditInfo.type = type;
    currentlyEditInfo.name = name;
    currentlyEditInfo.value = value;
    if (type == "CNAME") {
      $("#modalBody").html(`
  <div class="form-group">
  <label for="recipient-name" class="control-label">Edit to</label>
  <input type="text" class="form-control" placeholder='${value}' id="newValue">
</div>
  `);
    } else if (type == "MX") {
        let json = JSON.parse(value)
        currentlyEditInfo.value = json;
        $("#modalBody").html(`
    <div class="form-group">
    <label for="recipient-name" class="control-label">Priority</label>
    <input type="text" class="form-control" placeholder='${json.priority}' id="priority">
    </div>
    <div class="form-group">
    <label for="recipient-name" class="control-label">Destination</label>
    <input type="text" class="form-control" placeholder='${json.destination}' id="destination">
    </div>
        `)
    } else if(type == "SPF") {
      $("#modalBody").html(`
      <div class="form-group">
      <label for="recipient-name" class="control-label">Update SPF</label>
      <textarea type="text" class="form-control" id="spfdata"></textarea>
      </div>
 
          `)
    }
  };
  document.removedns = function (type, domain) {
    if (type == "CNAME") {
      console.log(`Remove CNAME ${domain} `);
      vpapi.cname.remove(domain);
    } else if (type == "MX") {
       vpapi.mx.remove(domain,currentlyEditInfo.value.priority,currentlyEditInfo.value.destination);
    }
  };
  document.adddns = async function (type) {
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
 `);
    } else if (type == "SPF") {
      let data = await vpapi.spf.domains();
      console.log(data);
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
  `);
      for (let i = 0; i < data.length; i++) {
        $("#domain").append(
          $("<option>", {
            value: data[i],
            text: data[i],
          })
        );
      }
    }
  };
  document.getElementById(
    "dnsLoadingText"
  ).innerHTML = `Loading DNS Records.. Loaded ${records.length} DNS Records`;
  document.getElementById("applyDns").onclick = async function () {
    console.log("Apply DNS");
    $("#applyDns").html("Applying..");
      // disable
      console.log(currentlyEditInfo.type)
      $("#applyDns").attr("disabled", true);
    if (currentlyEditInfo.type == "CNAME") {
       
      if (!document.getElementById("newValue").value) {
        $("#applyDns").html("Please enter new value");
        return;
      }
      await vpapi.cname.remove(currentlyEditInfo.name);
      await vpapi.cname.add(
        currentlyEditInfo.name,
        document.getElementById("newValue").value
      );
      $("#applyDns").html("Applied");
      await wait(1000);
      // refresh page

      window.location.reload();
    } else if (currentlyEditInfo.type == "MX") {
      await vpapi.mx.remove(currentlyEditInfo.name,currentlyEditInfo.value.priority,currentlyEditInfo.value.destination);
      await vpapi.mx.add(
        currentlyEditInfo.name,
        parseInt(document.getElementById("priority").value),
        document.getElementById("destination").value
      );
      window.location.reload();
    } else if (currentlyEditInfo.type == "SPF") {
      console.log("SPF")
      var error = await vpapi.spf.remove(currentlyEditInfo.name,currentlyEditInfo.value);
      if (!error) {
        $("#editRecordError").removeAttr("hidden");
        $("#editRecordErrorText").html(error);
        return;
      }
      var error,msg = await vpapi.spf.add(currentlyEditInfo.name,document.getElementById("spfdata").value);
      if (!error) {
        $("#editRecordError").removeAttr("hidden");
        $("#editRecordErrorText").html(msg);
        return;
      }
      await wait(1000)
      window.location.reload()
    }
  };
  document.getElementById("ModalAddRecord").onclick = async function () {
    $("#ModalAddRecord").attr("disabled", true);
    if (currentlyAddInfo.type == "CNAME") {
      await vpapi.cname.add($("#source").val() + ".", $("#destination").val());
    } else if (currentlyAddInfo.type == "SPF") {
      let res = await vpapi.spf.add($("#domain").val(), $("#source").val());
      if (res) {
        window.location.reload();
      } else {
        $("#ModalAddRecord").html("Error");
      }
      await wait(3000);
      $("#ModalAddRecord").attr("disabled", false);
      $("#ModalAddRecord").html("Add");
    }
  };
  let table = document.getElementById("dns_lists");
  for (let i = 0; i < records.length; i++) {
    // add item to table
    let recordType = records[i].type.toUpperCase();
    let name = records[i].domain || records[i].cnamerecord;

    let record = records[i];
    let value =
      record.html ||
      record.destination ||
      record.mxrecord ||
      record.currentspfdata;
    let row = document.createElement("tr");
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
    ttl.innerText = "14400";
    nameTd.innerHTML = record.domain || record.cnamerecord;
    valueTd.innerHTML = value;
    type.innerHTML = records[i].type.toUpperCase();
     if(record.mxrecord) {
        action.innerHTML = `
<div class="btn btn-primary btn-outline" onclick="document.editdns('${recordType}','${name}','${escape(JSON.stringify(record.info))}')">Edit</div>
<div class="btn btn-danger btn-outline" onclick="document.removedns('${recordType}','${name}')">Delete</div>
`;
     } else {
        action.innerHTML = `
        <div class="btn btn-primary btn-outline" onclick="document.editdns('${recordType}','${name}','${escape(value)}')">Edit</div>
        <div class="btn btn-danger btn-outline" onclick="document.removedns('${recordType}','${name}')">Delete</div>
        `;
     }
    table.querySelector("tbody").appendChild(row);
  }
})();
