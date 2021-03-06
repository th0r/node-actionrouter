/* global describe, it, before, expect */

var Router = require('../lib/router')
  , MockApplication = require('./mocks/mockapplication');
  

describe('Router#namespace', function() {
  
  function handler(controller, action) {
    return function() {
      return { controller: controller, action: action };
    };
  }

  describe('namespace with resources', function() {
    var app, router;
    
    before(function() {
      app = new MockApplication();
      router = new Router(handler);
      router.define(function(method, path, handler) {
        app[method](path, handler);
      });
      router.assist(function(name, entry) {
        app.helper(name, entry);
      });
      
      router.namespace('admin', function() {
        router.resources('posts');
      });
    });
    
    it('should define application routes', function() {
      expect(Object.keys(app.map)).to.have.length(4);
      expect(app.map['get']).to.be.an('array');
      expect(app.map['get']).to.have.length(4);
      expect(app.map['post']).to.be.an('array');
      expect(app.map['post']).to.have.length(1);
      expect(app.map['put']).to.be.an('array');
      expect(app.map['put']).to.have.length(1);
      expect(app.map['delete']).to.be.an('array');
      expect(app.map['delete']).to.have.length(1);
    });
    
    it('should create route to index action', function() {
      var route = app.map['get'][0];
      expect(route.path).to.equal('/admin/posts.:format?');
      expect(route.handler).to.be.a('function');
      
      var rv = route.handler();
      expect(rv.controller).to.equal('admin/posts');
      expect(rv.action).to.equal('index');
    });
    
    it('should define application helpers', function() {
      expect(Object.keys(app.helpers)).to.have.length(4);
    });
    
    it('should register index helper for route', function() {
      var entry = app.helpers.adminPosts;
      
      expect(entry).to.be.an('object');
      expect(entry.pattern).to.equal('/admin/posts.:format?');
      expect(entry.controller).to.equal('admin/posts');
      expect(entry.action).to.equal('index');
    });
    
    it('should register show helper for route', function() {
      var entry = app.helpers.adminPost;
      
      expect(entry).to.be.an('object');
      expect(entry.pattern).to.equal('/admin/posts/:id.:format?');
      expect(entry.controller).to.equal('admin/posts');
      expect(entry.action).to.equal('show');
    });
    
    it('should register new helper for route', function() {
      var entry = app.helpers.newAdminPost;
      
      expect(entry).to.be.an('object');
      expect(entry.pattern).to.equal('/admin/posts/new.:format?');
      expect(entry.controller).to.equal('admin/posts');
      expect(entry.action).to.equal('new');
    });
  
    it('should register edit helper for route', function() {
      var entry = app.helpers.editAdminPost;
      
      expect(entry).to.be.an('object');
      expect(entry.pattern).to.equal('/admin/posts/:id/edit.:format?');
      expect(entry.controller).to.equal('admin/posts');
      expect(entry.action).to.equal('edit');
    });
  });

});
