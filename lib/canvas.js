/*
 * @Author: Admin_CXx
 * @Date:   2021-03-16 13:39:11
 * @Last Modified by:   Admin_CXx
 * @Last Modified time: 2021-03-16 13:53:46
 */
/**
 * [规划圆角矩形路径]
 * @param  {[number]} x [圆角矩形起始路径水平位置]
 * @param  {[number]} y [圆角矩形起始路径垂直位置]
 * @param  {[number]} w [圆角矩形宽度]
 * @param  {[number]} h [圆角矩形高度]
 * @param  {[number]} r [圆角半径]
 */
CanvasRenderingContext2D.prototype.radiusRect = function(x, y, w, h, r) {
    this.moveTo(x, y + r); // 路径起始点
    this.arcTo(x, y + h, x + w, y + h, r); //左
    this.arcTo(x + w, y + h, x + w, y, r); //下
    this.arcTo(x + w, y, x, y, r); //右
    this.arcTo(x, y, x, y + h, r); //上
};
CanvasRenderingContext2D.prototype.fillRadiusRect = function(x, y, w, h, r) {
	this.radiusRect(x, y, w, h, r);
	this.fill();
};
CanvasRenderingContext2D.prototype.strokeRadiusRect = function(x, y, w, h, r) {
	this.radiusRect(x, y, w, h, r);
	this.stroke();
};
