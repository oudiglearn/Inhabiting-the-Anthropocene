// Cytoscape
$(function(){ // on dom ready

// Defines Nodes and Edges and Their Styles
var cy = cytoscape({
  container: $('#cy')[0],
  
  style: cytoscape.stylesheet()
    .selector('node')
        .css({
            'content': 'data(label)',
            'width': 'data(weight)',
            'height': 'data(weight)',
            'shape': 'data(faveShape)',
            'text-valign': 'center',
            'text-outline-width': 1,
            'background-color': 'data(color)',
            'color': 'white',
            'border-style': 'solid',
            'border-width': 1,
            'text-outcolor': '#888',
            'font-size': 25,
    })
    .selector(':selected')
        .css({
            'content': 'data(name)',
            'text-valign': 'center',
            'text-outline-width': 3,
            'font-size': 25,
            'background-color': 'data(color)',
            'color': 'white',
            'z-index': 10,
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'text-outcolor': 'black',
            'width': 'data(weight)',
            'height': 'data(weight)',
            'border-color': 'yellow',
            'border-width': 5
    })
    .selector('$node > node')
        .css({
            'color': 'black',
            'font-size': 30,
            'padding-top': '10px',
            'padding-left': '10px',
            'padding-bottom': '10px',
            'padding-right': '10px',
            'text-valign': 'top',
            'text-halign': 'center',
            'height': 200,
            'width': 100
    })            
    .selector('node.hovered')
        .css({
            'content': 'data(name)',
            'text-valign': 'center',
            'text-outline-width': 3,
            'color': 'white',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'z-index': 20,
            'text-outcolor': 'black',
            'width': 'data(weight)',
            'height': 'data(weight)',
            'border-color': 'yellow',
            'border-width': 5
    })        
    .selector('edge')
        .css({
            'width': 'data(width)',
            'line-color': 'data(AuthColor)',
            'line-style': 'data(style)',
            'target-arrow-shape': 'data(Arrow)',
          	'target-arrow-color': 'data(AuthColor)'
    })

    .selector('edge.hovered')
        .css({
            'content': 'data(comment)',
            'text-valign': 'center',
            'text-outline-width': 3,
            'color': 'white',
            'font-size': 25,
            'z-index': 20,
            'text-outcolor': 'black',
			'width': 'data(width)',
            'line-color': 'data(AuthColor)',
            'line-style': 'data(style)',
            'target-arrow-shape': 'data(Arrow)'    
    })
        
    .selector('.faded')
        .css({
            'opacity': .3,
            'text-opacity': 0
    })

    .selector('.invisible')
        .css({
            'opacity': 0,
            'text-opacity': 0
    })
    
    .selector('node.triggered')
        .css({
            'background-color': 'red',
            'border-color': 'black',
            'border-width': 1
    }),
    
  // Call the Nodes and Edges
  elements: BlogEles
    
});

// Layout Options
var circle = {
  name: 'circle',
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
  radius: undefined, // the radius of the circle
  startAngle: 3/2 * Math.PI, // the position of the first node
  counterclockwise: false, // whether the layout should go counterclockwise (true) or clockwise (false)
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
};
var concentric = {
    name: 'concentric',
    concentric: function(){ return this.data('weight'); },
    levelWidth: function( nodes ){ return 5; },
    minNodeSpacing: 30,
    fit: true,
    padding: 10,
    animate: true
  };
var cose = {
    name: 'cose',
    padding: 5,
    nodeRepulsion: 8000000,
    idealEdgeLength: 10,
    nodeOverlap: 100,
    edgeElasticity: 50,
    fit: true,
    animate: true
  };
var arbor = {
    name: 'arbor',
    maxSimulationTime: 8000,
    repulsion: 2000,
    stiffness: 200,
    edgeLength: 2,
//    infinite: true
};

// Calls Desired Layout for all but filter elements
cy.elements("[filter!='yes']").layout(arbor);

// Highlights nodes on hover
cy.on('mouseover', 'node', function(){
    if (this.data('filter') != 'yes'){
	    this.addClass('hovered')
	}
});
cy.on('mouseout', 'node', function(){
	this.removeClass('hovered')
 });

// Show edge comment on hover
cy.on('mouseover', 'edge', function(){
	this.addClass('hovered')
});
cy.on('mouseout', 'edge', function(){
	this.removeClass('hovered')
 });

// Links Nodes to the "Content" Div
cy.on('tap', 'node', function(){
    try { // your browser may block popups
        window.open( this.data('href'), 'content' );
    } catch(e){ // fall back on url change
        window.location.href = this.data('href');
    }
});

// Populate Comments Div on Edge Hover
cy.on('tap', 'edge', function(){
	try {
	    window.open( this.data('href'), 'comments');
	} catch(e){
	    window.location.href = this.data('href');
	}
});

// Add Faded Class
cy.on('tap', 'node', function (e) {
    // Only adds faded class if this isn't a filter node
    if (this.data('filter') != 'yes'){
        var node = e.cyTarget;
        var neighborhood = node.neighborhood().add(node);
        cy.elements().addClass('faded');
        neighborhood.removeClass('faded');
    }
});

// Remove Faded Class when you click on background
cy.on('tap', function (e) {
    if (e.cyTarget === cy) {
        cy.elements().removeClass('faded');
    }
});

// Filter by comment to add invisible class based on name of node
cy.on('tap', 'node', function () {
    if (!this.hasClass('triggered') && this.data('name') == 'Similar'){
        this.addClass('triggered');
        cy.filter(function(i, element){
            if (element.isEdge() && (element.data("comment") == 'Similar')){
                element.addClass('invisible');
            }
        })
    } else if (this.hasClass('triggered') && this.data('name') == 'Similar'){   
        this.removeClass('triggered'); 
        cy.filter(function(i, element){
            if (element.isEdge() && (element.data("comment") == 'Similar')){
                element.removeClass('invisible');
            }
        })
    } else if (!this.hasClass('triggered') && this.data('name') == 'Different'){
        this.addClass('triggered');
        cy.filter(function(i, element){
            if (element.isEdge() && (element.data("comment") == 'Different')){
                element.addClass('invisible');
            }
        })
    } else if (this.hasClass('triggered') && this.data('name') == 'Different'){   
        this.removeClass('triggered'); 
        cy.filter(function(i, element){
            if (element.isEdge() && (element.data("comment") == 'Different')){
                element.removeClass('invisible');
            }
        })
    }
});

// Sets zoom options
cy.on('layoutstop', function() {
    cy.maxZoom(2);
    cy.minZoom(.25);
    cy.fit(10);
});

// Resizes Graph to fit viewport
window.onresize = function() {
    cy.fit(10);
};

// Fit view to selection


}); // on dom ready

