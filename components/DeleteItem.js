import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import update from '../pages/update';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => {
          if (error) return <p>You don't have permission</p>;
          return (
            <button
              onClick={() => {
                if (confirm('Are you sure?')) deleteItem();
              }}
            >
              {this.props.children}
            </button>
          );
        }}
      </Mutation>
    );
  }
}

export default DeleteItem;
