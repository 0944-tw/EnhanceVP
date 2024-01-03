let items = PAGE.appGroups
function getGroup(name) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.desc == name) return item;
    }
    return undefined;   
}
function getItemFromGroup(group,name) {
    for (let i = 0; i < group.items.length; i++) {
        let item = group.items[i];
        if (item.file == name) return item;
    }
    return undefined;   
}
function updateItemFromGroup(group,name,newItem) {
    for (let i = 0; i < group.items.length; i++) {
        let item = group.items[i];
        if (item.file == name) group.items[i] = newItem;
    }
    return group;   
}
function updateItemFromAppGroup(newGroup,group) {
    for (let i= 0; i < PAGE.appGroups.length; i++) {
       if (PAGE.appGroups[i].desc == group.desc) PAGE.appGroups[i] = newGroup;

    }
}

let advnaced = getGroup("Advanced")
let cname = getItemFromGroup(advnaced,"simple_zone_editor")

cname.itemdesc = "DNS"
let newAdvancedGroup = updateItemFromGroup(advnaced,"simple_zone_editor",cname)
updateItemFromAppGroup(newAdvancedGroup,advnaced)
console.log("Applied AppGroups")