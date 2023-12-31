from fastapi import FastAPI, UploadFile, Form, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from typing import Annotated
import sqlite3

connect = sqlite3.connect('db.db', check_same_thread=False)
cur = connect.cursor()

cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items (
              id INTEGER PRIMARY KEY,
              title TEXT NOT NULL,
              image BLOB,
              price INTEGER NOT NULL,
              description TEXT,
              place TEXT NOT NULL,
              insertAt INTEGER NOT NULL
            )
            """)

app = FastAPI()

SERCRET = "super-cocoding"
manager = LoginManager(SERCRET, '/login')

@manager.user_loader()

def query_user(id):
  user = cur.execute(f"""
                     SELECT * from users WHERE id='{id}'
                     
                     """).fetchone()
  return user


@app.post('/login')
def login(id:Annotated[str,Form()],
          password:Annotated[str,Form()]):
  cur.row_factory = sqlite3.Row
  cur = cur.cursor()
  user = query_user(id)
  if not user:
    raise InvalidCredentialsException
  elif password != user['password']:
    raise InvalidCredentialsException
  
  access_token = manager.create_access_token(data={
    'sub' : {
    
    'id' : user['id'],
    'name' : user['name'],
    'email' : user['email']
    }
  })
  return {'access_token':access_token}

@app.post('/items')
async def create_item(image:UploadFile, 
                title:Annotated[str, Form()], 
                price:Annotated[int, Form()], 
                description:Annotated[str, Form()], 
                place:Annotated[str, Form()],
                insertAt: Annotated[int, Form()]
                ):
  image_bytes = await image.read()
  cur = connect.cursor()
  cur.execute(f"""
              INSERT INTO items(title, image, price, description, place, insertAt)
              VALUES ('{title}', '{image_bytes.hex()}', {price}, '{description}', '{place}', {insertAt})
              """)
  connect.commit()
  return '200'


@app.get('/items')
async def get_items():
  cur.row_factory = sqlite3.Row
  cur = connect.cursor()
  rows = cur.execute(f"""
                    SELECT * FROM items
                    """).fetchall()
  return JSONResponse(jsonable_encoder(dict(row) for row in rows))


@app.get('/images/{item_id}')
async def get_image(item_id):
  cur = connect.cursor()
  image_bytes = cur.execute(f"""
                            SELECT image from items WHERE id={item_id}
                            """).fetchone()[0] # hex
  return Response(content=bytes.fromhex(image_bytes), media_type="image/*")

@app.post('/signup')
def signup(id:Annotated[str,Form()], 
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           email:Annotated[str,Form()]):
  cur.execute(f"""
              INSERT INTO users(id,name,email,password)
              VALUES ('{id}','{name}','{email}','{password}')
            
              
              """)
  cur.commit()
  
  return '200'

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")