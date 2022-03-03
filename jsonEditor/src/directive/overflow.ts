import { Directive, DirectiveBinding } from "@vue/runtime-core";

function getParentNode(el: HTMLElement) {
  let pNode;
  if (el.parentNode) {
    pNode = el.parentNode;
  } else {
    pNode = document;
  }
  return pNode;
}

function getLineHeight(el: HTMLElement) {
  let temp = document.createElement(el.nodeName), ret;
  temp.setAttribute("style", "margin:0; padding:0; "
      + "font-family:" + (el.style.fontFamily || "inherit") + "; "
      + "font-size:" + (el.style.fontSize || "inherit"));
  temp.innerHTML = "A";
  document.body.appendChild(temp);
  ret = temp.clientHeight;
  document.body.removeChild(temp);
  return ret;
}


export default {
  mounted: function (el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value.maxLine) {
      return;
    }
    const lineHeight = binding.value.lineHeight || getLineHeight(el);
    el.style.maxHeight = (lineHeight * binding.value.maxLine) + 'px';
    let parentNode = getParentNode(el);
    // 防止本身不可见
    document.body.appendChild(el);
    /* 第1步：先要创建一个容器`span`去获取文本的宽度 */
    // 获取当前元素的style
    const curStyle = window.getComputedStyle(el, '');
    // 创建一个容器来记录文字的width
    const textDiv = document.createElement('div');
    // 设置新容器的字体样式，确保与当前需要隐藏的样式相同
    textDiv.style.fontSize = curStyle.fontSize;
    textDiv.style.fontWeight = curStyle.fontWeight;
    textDiv.style.fontFamily = curStyle.fontFamily;
    textDiv.style.width = el.offsetWidth + 'px';
    textDiv.style.lineHeight = lineHeight + 'px';
    // 设置新容器的文字
    textDiv.innerHTML = el.innerHTML;
    // 将容器插入body，如果不插入，offsetWidth为0
    document.body.appendChild(textDiv);

    console.log(textDiv.offsetHeight,el.offsetHeight)
    if (textDiv.offsetHeight > el.offsetHeight) {
      el.style.overflow = 'hidden';
      const wrapperDiv = document.createElement('div');
      wrapperDiv.className = "__overflow_wrapper__";
      parentNode.appendChild(wrapperDiv);
      wrapperDiv.appendChild(el);
      const detailDiv = document.createElement("div");
      const detailLink = document.createElement("a");
      detailLink.style.color = "#54adcf"
      detailLink.innerHTML = binding.value.text || '查看全部';
      detailLink.href='#'
      detailDiv.appendChild(detailLink);
      detailDiv.addEventListener('click', (e) => {
        e.preventDefault();
        binding.value.onClick && binding.value.onClick(el);
      })
      wrapperDiv.appendChild(detailDiv);
    }else{
      document.body.removeChild(el);
      parentNode.appendChild(el);
    }
    document.body.removeChild(textDiv);
  }
}
