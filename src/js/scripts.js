function loadScript(url, callback) {
  let script = document.createElement('script')
  script.type = 'text/javascript'
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  }
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}

function resizeGridItem(item){
  grid = document.getElementsByClassName("achivement-sec")[0];
  rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  image = item.querySelector('.image') !== null ? item.querySelector('.image').getBoundingClientRect().height : 0;
  rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap + image) / (rowHeight + rowGap - 2));
  item.style.gridRowEnd = `span ${rowSpan}`;
}

function resizeAllGridItems(){
  allItems = document.querySelectorAll(".achivement-sec .card");
  for(x = 0; x < allItems.length; x++){
    resizeGridItem(allItems[x]);
  }
}

window.onload = resizeAllGridItems();
window.addEventListener("resize", resizeAllGridItems);

loadScript('./js/ripple.js')