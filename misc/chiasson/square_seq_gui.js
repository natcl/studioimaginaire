autowatch = 1;

var first_x = 0.;
var first_y = 0.;
var first_pos_x = 0.;
var first_post_y = 0.;

var current_box = 0.;
var box_number = 4;
var box_size = Math.abs(sketch.screentoworld(0,sketch.size[1])[1] / 2);

var boxes = new Array();

function init_boxes()
{
    for (var i = 0; i < box_number; i++)
        boxes.push(new Box(-2+(box_size*i)*1.5,0, box_size, String(i + 1)));
    //boxes.sort(function() {return 0.5 - Math.random()});
    draw_boxes();    
}

function Box(x, y, size, label)
{
    this.x = x;
    this.y = y;
    this.size = box_size;
    this.label = label;
    this.clicked = 0;
}

Box.prototype.draw = function()
{
    var x1 = this.x;
    var x2 = this.x;
    var x3 = this.x + this.size;
    var x4 = this.x + this.size;
    var y1 = this.y;
    var y2 = this.y - this.size;
    var y3 = this.y - this.size;
    var y4 = this.y;
    var z1 = 0.;
    var z2 = 0.;
    var z3 = 0.;
    var z4 = 0.;
    // Fond
    sketch.glcolor(0,0,0,0.3);
    if (this.clicked)
    	sketch.glcolor(0,0.4,0,0.3);
    sketch.quad(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4);
    // Cadre
    sketch.glcolor(0,0,0,1);
    sketch.framequad(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4);
    // Texte
    sketch.moveto(this.x + this.size / 2, this.y - this.size / 2);
    sketch.glcolor(0,0.0);
    sketch.text(this.label);
}

init_boxes();

function bang()
{
	draw_boxes();
}


function test()
{
    boxes[0].x = 0;
    draw_boxes();
}

function draw_boxes()
{
    sketch.glclear();
    for (var b in boxes)
    {
        boxes[b].draw();
    }
    refresh();
}

function onclick (x, y)
{
    first_x = x;
    first_y = y;
    current_box = box_collide(sketch.screentoworld(x,y)[0],sketch.screentoworld(x,y)[1]);
    if (current_box)
    {
        first_pos_x = sketch.worldtoscreen(boxes[current_box -1].x, boxes[current_box -1].y)[0];
        first_pos_y = sketch.worldtoscreen(boxes[current_box -1].x, boxes[current_box -1].y)[1];
    }
}

function ondblclick (x, y, button, mod1, shift, caps, opt, mod2)
{

    current_box = box_collide(sketch.screentoworld(x,y)[0],sketch.screentoworld(x,y)[1]);
    boxes[current_box -1].clicked = 1;
    draw_boxes();
    outlet(0,current_box);
    

}

function ondrag (x, y, button, mod1, shift, caps, opt, mod2)
{
       if (current_box)
       {
            var xx = first_pos_x + (x - first_x);
            var yy = first_pos_y + (y - first_y);
			if (! frame_collide(xx,yy))
			{
            	boxes[current_box - 1].x = sketch.screentoworld(xx,yy)[0];
            	boxes[current_box - 1].y = sketch.screentoworld(xx,yy)[1];
			}
       }
    draw_boxes();
}

function frame_collide(x, y)
{
	var xx = sketch.screentoworld(x,y)[0];
	var yy = sketch.screentoworld(x,y)[1];
	if (yy > 1 || yy < -0.5 || xx + box_size > get_ratio()  || xx < -get_ratio() )
		return 1;
	else
		return 0;
}

function other_collide(x, y)
{
	
}

function box_collide(x, y)
{
    for (var b in boxes)
    {
        if ((x >= boxes[b].x && x <= boxes[b].x + boxes[b].size) && (y <= boxes[b].y && y >= boxes[b].y - boxes[b].size))
        {
            return parseInt(b)+1;
        }
    }
    return 0;
}

function onresize(w,h)
{
	box_size = Math.abs(sketch.screentoworld(0,sketch.size[1])[1] / 2);
	draw_boxes();
}

function set_number_of_boxes(x)
{
	clear();
	box_number = x;
	init_boxes();
}


function get_ratio()
{
	return sketch.size[0] / sketch.size[1];
}


function clear()
{
    sketch.glclear();
    boxes = new Array();
    refresh();
}
