import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  onChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  sumbitForm = async (event, updateItem) => {
    event.preventDefault();
    // call the mutation
    const res = await updateItem({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    // Redirect them to single item page
    console.log(res);
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id }
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;
          if (!data.item) return <p>No Item found for ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={event => this.sumbitForm(event, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        name="title"
                        type="text"
                        id="title"
                        placeholder="Title"
                        defaultValue={data.item.title}
                        onChange={this.onChange}
                        required
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        name="price"
                        type="number"
                        id="price"
                        placeholder="Price"
                        defaultValue={data.item.price}
                        onChange={this.onChange}
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        name="description"
                        id="description"
                        placeholder="Enter a Description"
                        defaultValue={data.item.description}
                        onChange={this.onChange}
                        required
                      />
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
