const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const path = require('path');
const debug = require('debug')(`${path.basename(__dirname)}:${path.basename(__filename)}`);

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
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
      debug(user);
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
      debug(post);
      return post;
    },
    async deletePost(_, { postId }, context) {
      try {
        await Post.findByIdAndDelete(postId);
        return `post ${postId} deleted`;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}