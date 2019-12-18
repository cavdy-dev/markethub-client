import UpdateItem from '../components/UpdateItem';

export default ({ query: { id } }) => {
  return (
    <div>
      <UpdateItem id={id} />
    </div>
  );
};
