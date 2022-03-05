export default {
  toHtmlLineBreak(value: string): string {
    return value.replaceAll("\r\n", "<br/>")
        .replaceAll("\n", "<br/>");
  },
  timeStepFormat(time: number) {
    let dis = (new Date()).getTime() - time;
    let minuteFormat = Math.floor(dis / 60000);
    if (minuteFormat === 0) {
      return '刚刚';
    }
    if (minuteFormat < 60) {
      return minuteFormat + '分钟前';
    }
    let hourFormat = Math.floor(dis / 3600000);
    if (hourFormat < 24) {
      return hourFormat + '小时前';
    }
    let dayFormat = Math.floor(dis / (3600000 * 24));
    if (dayFormat == 0) {
      dayFormat = 1;
    }
    return dayFormat + "天前";
  }
}
