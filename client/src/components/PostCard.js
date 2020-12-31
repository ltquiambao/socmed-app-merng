import React from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const PostCard = ({ 
  post: { 
    id, 
    username, 
    body, 
    createdAt, 
    likesCount, 
    commentsCount, 
    likes 
  } 
}) => {

  const likePost = () => {

  }

  const commentOnPost = () => {

  }
  
  return (
    <Card>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as='div' labelPosition='right' onClick={likePost}>
          <Button basic color='teal'>
            <Icon name='heart' />
          </Button>
          <Label basic color='teal' pointing='left'>
            {likesCount}
          </Label>
        </Button>
        <Button as='div' labelPosition='right' onClick={commentOnPost}>
          <Button basic color='blue'>
            <Icon name='comments' />
          </Button>
          <Label basic color='blue' pointing='left'>
            {commentsCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  )
}

export default PostCard;