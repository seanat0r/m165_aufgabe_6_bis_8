    const express = require('express');
    const mongoose = require('mongoose');
    const User = require('./User');
    const fs = require('node:fs/promises');
    const path = require('node:path');
    const crypto = require('node:crypto');
 
    const app = express();
    const PORT = 3000;

    // save the avatar in the filesystem
    // save a avatar from base64
    async function saveAvatar(base64) {
        if (!base64) return '';

        // check format for base64 with capture groups
        const match = base64.match(
            /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/
        );

        if (!match) {
            throw new Error('Ungültiges Bildformat');
        }

        const extension = match[1] === 'jpeg' ? 'jpg' : match[1];

        // base64 to binary
        const buffer = Buffer.from(match[2], 'base64');

        if (buffer.length > 1024 * 1024) {
            throw new Error('Bild darf maximal 1 MB gross sein');
        }

        // new random name
        const filename = `${crypto.randomUUID()}.${extension}`;
        const directory = path.join(__dirname, 'public', 'uploads');

        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(path.join(directory, filename), buffer);

        return `/uploads/${filename}`;
    }

    // delete the avatar
    async function deleteAvatar(avatarPath) {
        if (!avatarPath) return;

        const filename = path.basename(avatarPath);
        const filepath = path.join(__dirname, 'public', 'uploads', filename);

        try {
            await fs.unlink(filepath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
 
    // Verbindung zu MongoDB
    mongoose.connect('mongodb://adminUser:123@localhost:27017/?authSource=admin');

    app.use(express.json({limit: '2mb' }));
    app.use(express.static('public'));
 
    app.get('/', (req, res) => {
        res.send('Hallo, Welt!');
    });

    app.get('/users', async (req, res) => {
        try {
            const users = await User.find();

            res.status(200).json(users);

        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    });

    app.get('/user/:id', async (req, res) => {
        try {

            const user = await User.findById(req.params.id)

            if (!user) {
                return res.status(404).json({
                    error: "No user found"
                });
            }

            res.status(200).json(user);

        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    });

    app.post('/user', async (req, res) => {
        try {

            const avatarPath = await saveAvatar(req.body.avatar);

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                color: req.body.color,
                avatar: avatarPath
            });

            await user.save();

            res.status(201).json(user);

        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    });

    app.put('/user/:id', async (req, res) => {
        try {
            const data = {...req.body};
            let oldAvatar = null;

            if (data.avatar) {
                const oldUser = await User.findById(req.params.id);

                if (!oldUser) {
                    return res.status(404).json({
                        error: 'User not found'
                    });
                }

                oldAvatar = oldUser.avatar;

                data.avatar = await saveAvatar(data.avatar);
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                data,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            if (oldAvatar) {
                await deleteAvatar(oldAvatar);
            }

            res.status(200).json(user);

        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    });

    app.delete('/user/:id', async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({
                    error: 'User not found.'
                });
            }

            await deleteAvatar(user.avatar);

            res.status(204).send();
            

        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    });
 
    app.listen(PORT, () => {
        console.log(`Server läuft auf http://localhost:${PORT}`);
    });
