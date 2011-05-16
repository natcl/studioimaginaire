autowatch = 1;

outlets = 2;
var first_x = 0.;
var first_y = 0.;
var first_pos_x = 0.;
var first_pos_y = 0.;

var current_box = 0.;
var first_slot = 0;
var box_number = 4;
var box_size = Math.abs(sketch.screentoworld(0,sketch.size[1])[1] / 2);

var boxes = new Array();
var slots = new Slots();

function init_slots()
{
    for (var j = 0; j < box_number; j++)
    {
        slots.slots.push(0);
    }
}

function init_boxes()
{
    for (var i = 0; i < box_number; i++)
        boxes.push(new Box(-get_ratio()+get_ratio()/3+(box_size*i) * 1.5, 0.5 + box_size/2, box_size, String(i + 1)));
    //boxes.sort(function() {return 0.5 - Math.random()});
    init_slots();
    draw();    
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

function Slots(number)
{
    this.slots = new Array();
}

Slots.prototype.draw = function()
{
    var slot_width = get_ratio() * 2 / box_number
    var y1 = 0;
    var y2 = -1;
    var y3 = -1;
    var y4 = 0;
    var z1 = 0.;
    var z2 = 0.;
    var z3 = 0.;
    var z4 = 0.;
    
    for (var i = 0 ; i <= box_number ; i++)
    {
        //sketch.glcolor(0,0,0,1);
        sketch.framequad(slot_width*(i-1)-get_ratio(), y1, z1, slot_width*(i-1)-get_ratio(), y2, z2, slot_width*i-get_ratio(), y3, z3, slot_width*i-get_ratio(), y4, z4);
        //sketch.glcolor(0.2,0.2,0.2,1);
        //sketch.quad(slot_width*(i-1)-get_ratio(), y1, z1, slot_width*(i-1)-get_ratio(), y2, z2, slot_width*i-get_ratio(), y3, z3, slot_width*i-get_ratio(), y4, z4);
    }
}

init_boxes();

function bang()
{
    post(slots.slots);post();
}

function draw_boxes()
{
    for (var b in boxes)
    {
        boxes[b].draw();
    }
}

function draw()
{
    sketch.glclear();
    slots.draw();
    draw_boxes();
    refresh();
}

function onclick (x, y)
{
    first_x = x;
    first_y = y;
    current_box = box_collide(sketch.screentoworld(x,y)[0],sketch.screentoworld(x,y)[1]);
    first_slot = cell_collide(x,y);
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
    draw();
    outlet(0,current_box);
    
    var contains = 0;
    
    for (var b in boxes)
    {
        if (boxes[b].clicked == 0)
        {
            outlet(1,0)
            return;
        }
    }         
    outlet(1,1);
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
           
           // Release
        if (button == 0)
        {
            var slot = cell_collide(x, y); 
            //
            
            // If release happens in lower part
            if (slot > 0)
            {    
                
                // If slot is not empty, return object to initial position
                if (slots.slots[slot-1] > 0)
                {
                    boxes[current_box - 1].x = sketch.screentoworld(first_pos_x,first_pos_y)[0];
                    boxes[current_box - 1].y = sketch.screentoworld(first_pos_x,first_pos_y)[1];
                }
                // If slot is empty, move box there
                if (slots.slots[slot-1] == 0)
                {
                    slots.slots[first_slot-1] = 0;
                    slots.slots[slot-1] = boxes[current_box - 1].label;
                    boxes[current_box - 1].x = sketch.screentoworld(sketch.worldtoscreen(get_ratio(), y)[0] / boxes.length * slot, y)[0] - get_ratio() / boxes.length - (box_size/2);
                    boxes[current_box - 1].y = -0.5 + (box_size/2);
                }
            }
            // If release happens in upper part
            if (slot == 0)
            {
                slots.slots[first_slot-1] = 0;
            }
        }     
    }
 
    draw(); 
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

function cell_collide(x, y)
{
    if (sketch.screentoworld(x,y)[1] < 0)
        return Math.ceil(x / parseInt(sketch.worldtoscreen(get_ratio())) * (boxes.length));
    else
        return 0;
}

function onresize(w,h)
{
    box_size = Math.abs(sketch.screentoworld(0,sketch.size[1])[1] / 2);
    draw();
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
    slots.slots = new Array();
    boxes = new Array();
    outlet(1,0);
    refresh();
}

function get_order()
{
    var temp_list = new Array()
    post(slots.slots);post();
    for (var i = 0 ; i < slots.slots.length ; i++)
    {
    	temp_list.push(parseInt(slots.slots[i]));
    }
    outlet(0,temp_list);
}

function sortx(a,b)
{
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else return 0;
    
}
