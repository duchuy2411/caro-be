/**
 * @swagger
 * /api/users/all:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /api/users:
 *  post:
 *    parameters:
 *      - name: displayname
 *        in: formData
 *        required: true
 *        type: string
 *      - name: username
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        in: formData
 *        required: true
 *        type: string
 *      - name: email
 *        in: formData
 *        required: true
 *        type: string  
 *    responses:
 *      '200':
 *        description: A successful response
 */

 =/**
 * @swagger
 * /api/users:
 *  post:
 *    parameters:
 *      - name: displayname
 *        in: formData
 *        required: true
 *        type: string
 *      - name: username
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        in: formData
 *        required: true
 *        type: string
 *      - name: email
 *        in: formData
 *        required: true
 *        type: string  
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /boards:
 *  get:
 *    description: Request all board
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /boards:
 *  description: Add queue Quck play
 *  post:
 *    parameters:
 *      - name: title
 *        in: formData
 *        required: true
 *        type: string
 *      - name: description
 *        in: formData
 *        required: true
 *        type: string
 *      - name: id_user1
 *        in: formData
 *        required: true
 *        type: string
 *    responses:
 *      '201':
 *        description: A successful response
 */

/**
 * @swagger
 * /boards/{id} :
 *  description: Get board by code
 *  get:
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *    responses:
 *      '201':
 *        description: A successful response
 */

/**
 * @swagger
 * /boards/join :
 *  post:
 *    description: Join board
 *    parameters:
 *      - in: formData
 *        name: boardid
 *        type: integer
 *        required: true
 *      - in: formData
 *        name: user2
 *        type: string
 *        required: true
 *    responses:
 *      '201':
 *        description: A successful response
 */

/**
 * @swagger
 * /boards/leave :
 *  post:
 *    description: Leave board
 *    parameters:
 *      - in: formData
 *        name: boardid
 *        type: integer
 *        required: true
 *      - in: formData
 *        name: user
 *        type: string
 *        required: true
 *    responses:
 *      '201':
 *        description: A successful response
 */

/**
 * @swagger
 * /matchs :
 *   
 *  post:
 *    description: Create Match
 *    parameters:
 *      - in: formData
 *        name: codeBoard
 *        type: integer
 *        required: true
 *    responses:
 *      '201':
 *        description: A successful response
 */

/**
 * @swagger
 * /matchs/update :
 *  post: 
 *    description: Update/Add step Match / Step format x 10, y 20, user ObjectId
 *    parameters:
 *      - in: formData
 *        name: id_board
 *        type: integer
 *        required: true
 *      - in: formData
 *        name: step
 *        type: object
 *        required: false
 *      - in: formData
 *        name: size
 *        type: integer
 *        required: false
 *    responses:
 *      '201':
 *        description: A successful response
 */

/**
 * @swagger
 * /matchs/win :
 *  post: 
 *    description: Update winner and auto add/sub cup player
 *    parameters:
 *      - in: formData
 *        name: id_board
 *        type: integer
 *        required: true
 *      - in: formData
 *        name: id_winner
 *        type: string
 *        required: true
 *      - in: formData
 *        name: id_loser
 *        type: string
 *        required: true
 *    responses:
 *      '201':
 *        description: A successful response
 */



/**
 * @swagger
 * /boards/quickplay:
 *  post:
 *    parameters:
 *      - name: iduser
 *        in: formData
 *        required: true
 *        type: string
 *      - name: cup
 *        in: formData
 *        required: true
 *        type: number
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /boards/quickplay:
 *  get:
 *    responses:
 *      '200':
 *        description: A successful response
 */

