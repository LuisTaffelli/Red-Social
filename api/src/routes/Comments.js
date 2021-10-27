const router = require('express').Router();
const {User,
	Post,
	Comment,
	User_Comment,
	Comment_Post,
	Post_User} = require('../db.js');
const database_Utils = require('./utils.js')





router.get('/:username', async (req, res)=>{
	try{
		const {username} = req.params
		const comments = await database_Utils.DB_Allcomments(username)
		return res.status(202).send(comments)
	} catch (e){
		return res.status(404).send('This user has no Comments')
	}
})

router.post('/', async (req, res)=>{
	try {
		const {title, content, username} = req.body
		const Comment = await Comments.create({title,content})
		const UserAssociation = await database_Utils.DB_UserID(username)
		Comment.addUser(UserAssociation, {through: {username}})
		return res.status(202).send(Comment)
	} catch(e) {
		return res.status(404).send('Invalid username for request')
	}
})

router.put('/:id', async (req, res)=>{
	if(!req.body.contentData){
		return res.status(404).send('Invalid content for editing')	
	}
	try{
		const {id} = req.params
		const {contentData} = req.body
		const Comment = await database_Utils.DB_Commentedit(id, contentData)
		return res.status(202).send('Edited Succesfully')
	}catch(e){
		return res.status(404).send('Invalid comment ID')
		
	}
})

router.delete('/:id', async (req, res)=>{
	try {
		const {id} = req.params
		const Comment = await database_Utils.DB_Commentdestroy(id)
		return res.status(200).send(Comment)
	}catch(e){
		return res.status(404).send(e)
	}
})


module.exports = router;