import express from 'express';
import prisma from '../utils/prisma.js';
import { validatePost } from '../validators/post.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/', auth, async (req, res) => {
  const data = req.body;

  const validationErrors = validatePost(data);

  if (Object.keys(validationErrors).length !== 0) {
    return res.status(400).json({
      error: validationErrors,
    });
  }

  const postData = {
    file: data.file,
    description: data.description,
    created_at: new Date(),
    userId: req.user.payload.id,
    title: data.title,
    directions: data.directions,
    coordinates: data.coordinates,
    country: data.country,
    tags: data.tags,
  };

  try {
    const post = await prisma.post.create({
      data: postData,
    });
    return res.json(post);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (req.user.payload.id !== post.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.post.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete post' });
  }
});

router.get(`/country/tags`, async (req, res) => {
  const [ selectedTags ] = req.body.tags;

  try {
    const posts = await prisma.post.findMany({
        where: {
            country: req.body.country,
            tags: {
              hasEvery: selectedTags,
            },
          },
      })

    res.json(posts);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/:country', async (req, res) => {

    let countryName = req.params.country
    let country = countryName.charAt(0).toUpperCase() + countryName.slice(1);

    try {
      const posts = await prisma.post.findMany({
          where: {
              country: country
            },
        })
      res.json(posts);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

router.get(`/tags`, async (req, res) => {
    const [ selectedTags ] = req.body.tags;
  
    try {
      const posts = await prisma.post.findMany({
          where: {
              tags: {
                hasEvery: selectedTags,
              },
            },
        })
  
      res.json(posts);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
          });
    
        res.json(post);
      } catch (error) {
        
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch posts' });
      }
})


export default router;


//router.get('/:id')

