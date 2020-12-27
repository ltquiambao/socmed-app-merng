const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const debug = require('../../util/debugger')(__dirname, __filename);

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if(post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      debug('createPost:user', user);

      if(body.trim() === '') {
        throw new UserInputError('Post body must not be empty');
      }
      
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
      debug('createPost:post', post);
      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      debug('deletePost:user', user);
      try {
        const post = await Post.findById(postId);
        if(user.username === post.username) {
          await post.delete();
          return `post ${postId} deleted`;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const user = checkAuth(context);

      const post = await Post.findById(postId);
      if(post){
        const liked = post.likes.find(like => like.username === user.username);
        if(liked) {
          post.likes = post.likes.filter(like => like.username !== user.username);
        } else {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString()
          })
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
}