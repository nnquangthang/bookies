//add template-extension
Managers = new Mongo.Collection('managers');
Customers = new Mongo.Collection('customers');
CustomerCarts = new Mongo.Collection('customerCarts');
Books = new Mongo.Collection('books');

if (Meteor.isClient) {
  //Subscribe
  var managers = Meteor.subscribe('managers');
  Meteor.subscribe('customers');
  Meteor.subscribe('customerCarts');
  Meteor.subscribe('books');

  Template.managerDashboard.helpers({
    'isMod': function(){
      if(Meteor.userId() && managers.ready()){
        var currentUserId = Meteor.userId();
        var manager = Managers.findOne({userId: currentUserId});
        if(manager){
          return manager.roles === "mod" || "admin";
        };
      };
    },    
    'isAdmin': function(){
      if(Meteor.userId() && managers.ready()){
        var currentUserId = Meteor.userId();
        var manager = Managers.findOne({userId: currentUserId});
        if(manager){
          return manager.roles === "admin";
        };
      };
    },
  });
  //start customersList
  Template.customersListView.helpers({
    'customers': function(){
      return Customers.find({}, {
        sort:{
          firstName: 1,
          lastName : 1,
          studentId: 1,
        }});
    },
    'selectedClass': function(){
      var selectedCustomerId = Session.get('selectedCustomerId');
      if(this._id==selectedCustomerId){
        return "selected";
      };
    },
  });
  Template.customer.inheritsHelpersFrom('customersListView');
  Template.customersListView.events({
    'click .li-customer': function(){
      var selectedCustomerId = this._id;
      Session.set('selectedCustomerId', selectedCustomerId);
    },
  });
  //end customersList

  //start customerData
  Template.customerData.helpers({
    'customerData': function(){
      var selectedCustomerId = Session.get('selectedCustomerId');
      return Customers.findOne({_id: selectedCustomerId});
    },
  });
  //end customerData
  //start customerCart
  Template.customerCart.helpers({
    'customerCart': function(){
      var selectedCustomerId = Session.get('selectedCustomerId');
      return CustomerCarts.find({customerId: selectedCustomerId});
    },
    'bookDetails': function(){
      var bookId = this.bookId
      return Books.findOne({_id: bookId});
    },
  });
  //end customerCart
  //Insert new Template Helpers above.
}

if (Meteor.isServer) {
  Meteor.publish('managers', function(){
    var currentUserId = this.userId;
    return Managers.find({userId: this.userId});
  });

  Meteor.publish('customers', function(){
    return Customers.find();
  });
  Meteor.publish('customerCarts', function(){
    return CustomerCarts.find();
  });
  Meteor.publish('books', function(){
    return Books.find({}, {sort:{subject: -1}});
  });


}
