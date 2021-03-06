"use strict";

define([
    'd2/actors/observable',
    'd2/utils/rectangle',
    'd2/utils/vector'
  ], function(Observable, SimpleRectangle, Vector) {

    var temp = new Vector();

    var Actor = function(view, position, controller) {
      Observable.call(this);

      this.view = view;
      this.bounds = new SimpleRectangle();

      this.boundingBox = new SimpleRectangle();
      this.position = new Vector();
      this.scale = new Vector(1, 1);
      this.children = [];
      this.rotation = 0;
      this.depth = 0.5;
      this.isAlive = true;

      this.collisionBits = 0;
      this.controller = controller;

      if (position) {
        this.setPosition(position);
      }

      this.setView(view);
      this.updateBounds();
    };

    Actor.prototype = new Observable();

    Actor.prototype.setController = function(controller) {
      this.controller = controller;
    };

    Actor.prototype.setScale = function(x, y) {
      this.scale.set(x, y | x);
    };

    Actor.prototype.update = function(deltaTime) {
      deltaTime = deltaTime || 0;

      if (this.controller) {
        this.controller.update(deltaTime, this.position);//, this.position);
      }

      this.updateBounds();

      if (this.view) {
        if (this.view.update) {
          this.view.update(deltaTime);
        }
      }
    };

    Actor.prototype.updateBounds = function() {
      if (this.view) {
        var textureRegion = this.view.getTextureRegion();
        // set bounding rectangle
        this.bounds.set(
          - textureRegion.center.x,
          - textureRegion.center.y,
          textureRegion.width,
          textureRegion.height
        );

        this.updateBoundingBox();
      }
    };

    Actor.prototype.updateBoundingBox = function() {
      if (this.view) {
        this.boundingBox.set(this.bounds)
            .scale(this.scale.x, this.scale.y)
            .getBounds(this.rotation)
            .translate(this.position.x, this.position.y);
      }
    };

    Actor.prototype.getBoundingBox = function() {
      return this.boundingBox;
    };

    Actor.prototype.setView = function(view) {
      this.view = view;
      this.updateBounds();
    };

    Actor.prototype.setPosition = function(x, y) {
      this.position.set(x, y);
      this.updateBounds();
    };

    Actor.prototype.getTextureRegion = function() {
      return this.view.getTextureRegion();
    };

    return Actor;
});
