//add template-extension
Customers = new Mongo.Collection('customers');
CustomerCarts = new Mongo.Collection('customerCarts');
Books = new Mongo.Collection('books');

if (Meteor.isClient) {
  //Subscribe
  Meteor.subscribe('isManager');
  Meteor.subscribe('customers');
  Meteor.subscribe('customerCarts');
  Meteor.subscribe('books');

  Template.managerDashboard.helpers({
    'isMod': function(){
      if(Meteor.user()){
      var currentUser = Meteor.user();
      console.log("Mod "+currentUser.isMod);
      return currentUser.isMod;
    };
    },    
    'isAdmin': function(){
      if(Meteor.user()){
      var currentUser = Meteor.user();
      console.log("Admin "+currentUser.isAdmin);
      return currentUser.isAdmin;
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
  //Publish
  Meteor.publish('isManager', function(){
  var currentUser = this.userId;
  return Meteor.users.find({_id: currentUser}, {fields:{isMod: 1, isAdmin: 1}})
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

  //onCreateUser
  Accounts.onCreateUser(function(options, user){
    user.isMod = false;
    user.isAdmin = false;
    return user;
  });


}
