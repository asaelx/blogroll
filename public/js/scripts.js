//Since Backbone gets its id values with 'id', change to '_id' like MongoDB
Backbone.Model.prototype.idAttribute = '_id';

//Declare Model in Backbone
var Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: ''
    }
});

//Declare Colletion in Backbone
var Blogs = Backbone.Collection.extend({
    //Set url for collection
    url: "http://localhost:3000/api/blogs"
});

//Assign Collection in blogs
var blogs = new Blogs();

//Declare View in Backbone
var BlogView = Backbone.View.extend({
    model: new Blog(), //Use Blog Model
    tagName: 'tr', //This is the html container
    //Initialize when the view loads
    initialize: function(){
        //Use template with the class .blogs-list-template
        this.template = _.template($('.blogs-list-template').html());
    },
    //Register all the events with the classes from the html view
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel-blog': 'cancel',
        'click .delete-blog': 'delete'
    },
    //Edit function
    edit: function(){
        //Hide and show buttons
        $('.edit-blog').hide();
        $('.delete-blog').hide();
        this.$('.update-blog').show();
        this.$('.cancel-blog').show();

        //Store the values from the cells
        var author = this.$('.author').html();
        var title = this.$('.title').html();
        var url = this.$('.url').html();

        //Switch the text for input fields to allow edition
        this.$('.author').html($('<input>', {
            type: 'text',
            class: 'form-control author-update',
            value: author
        }));
        this.$('.title').html($('<input>', {
            type: 'text',
            class: 'form-control title-update',
            value: title
        }));
        this.$('.url').html($('<input>', {
            type: 'text',
            class: 'form-control url-update',
            value: url
        }));
    },
    //Update function
    update: function(){
        //Set values to the model from the input fields
        this.model.set('author', $('.author-update').val());
        this.model.set('title', $('.title-update').val());
        this.model.set('url', $('.url-update').val());

        //Save to the database
        this.model.save(null, {
            success: function(response){
                console.log('Successfully updated blog with _id: ' + response.toJSON()._id);
            },
            error: function(response){
                console.log('Failed to update blog!');
            }
        });
    },
    //Cancel function
    cancel: function(){
        //Render the default view when user clicks on cancel edition button
        blogsView.render();
    },
    //Delete function
    delete: function(){
        //Destroy model and record from database
        this.model.destroy({
            success: function(response){
                console.log('Successfully deleted blog with _id: ' + response.toJSON()._id);
            },
            error: function(){
                console.log('Failed to delete blog!');
            }
        });
    },
    //Render function
    render: function(){
        //Get element and put it in the template with the model in JSON format
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

//Declare view for all blogs
var BlogsView = Backbone.View.extend({
    model: blogs, //Use blogs collection
    el: $('.blogs-list'), //Get elemento from html with class .blogs-list (tbody)
    //Initialize
    initialize: function(){
        var self = this; //Store this in self to use in child functions
        //On add event, render view
        this.model.on('add', this.render, this);

        //On change event, render view but with a 30ms delay to let the application render all the changes
        this.model.on('change', function(){
            setTimeout(function(){
                self.render();
            }, 30);
        }, this);

        //On remove event, render view
        this.model.on('remove', this.render, this);

        //Fetch all records, all the blogs from database
        this.model.fetch({
            success: function(response){
                _.each(response.toJSON(), function(item){
                    console.log('Successfully got blog with _id: ' + item._id);
                });
            },
            error: function(){
                console.log('Failed to get blogs!');
            }
        });
    },
    render: function(){
        var self = this; //Store this in self to use in child functions
        this.$el.html(''); //Empty the element .blogs-list
        //Append each blog to the element .blogs-list
        _.each(this.model.toArray(), function(blog){
            //Append each blog as a BlogView using blog model
            self.$el.append((new BlogView({model: blog})).render().$el);
        });
        return this;
    }
});

//Document ready function
$(document).ready(function(){

    //On click in .add-blog button
    $('.add-blog').on('click', function(){
        //Create new Blog model and assign input values
        var blog = new Blog({
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val()
        });

        //Empty input fields when blog is added
        $('.author-input').val('');
        $('.title-input').val('');
        $('.url-input').val('');

        //Add blog model to blogs collection
        blogs.add(blog);

        //Save to the database
        blog.save(null, {
            success: function(response){
                console.log('Successfully saved blog with _id: ' + response.toJSON()._id)
            },
            error: function(){
                console.log('Failed to save blog!');
            }
        });
    });
});

//Declare blogsView
var blogsView = new BlogsView();
