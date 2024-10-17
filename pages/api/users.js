// pages/api/users.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('CRUDOP-WITH-NEXTJS-17-10-2024'); // Change to your database name

  switch (req.method) {
    case 'GET':
      try {
        const users = await db.collection('users').find({}).toArray();
        res.json(users);
      } catch (error) {
        console.error('GET error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
      case 'POST':
        const newUser = req.body;
      
        if (!newUser.name) {
          return res.status(400).json({ error: 'Name is required' });
        }
      
        try {
          const result = await db.collection('users').insertOne(newUser);
      
          // Get the inserted user directly from the result
          const insertedUser = { _id: result.insertedId, ...newUser };
      
          res.status(201).json(insertedUser);
        } catch (error) {
          console.error('POST error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
      

    case 'PUT':
      const { id, ...updates } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      try {
        const result = await db.collection('users').updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated' });
      } catch (error) {
        console.error('PUT error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;

    case 'DELETE':
      const { userId } = req.body;

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      try {
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(204).end();
      } catch (error) {
        console.error('DELETE error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
