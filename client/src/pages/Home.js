import React from 'react';
import { Grid, Image } from 'semantic-ui-react'
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import PostCard from '../components/PostCard';

const Home = (props) => {
  const { loading, error, data: { getPosts: posts } } = useQuery(FETCH_POSTS_QUERY);

  if(posts) {
    console.log(posts);
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading 
        ? (<h1>Loading posts...</h1>)
        : (
            posts && posts.map(post => (
              <Grid.Column key={post.id}>
                <PostCard post={post} />
              </Grid.Column>
            ))
          )
        }
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts{
      id body createdAt username likesCount
      likes{
        username
      }
      commentsCount
      comments{
        id username createdAt body
      }
    }
  }
`;

export default Home;