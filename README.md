# room-status

Room status is a bring-your-own-device Room Occupancy app. As such it displays if a room is currently in use or free to occupy.
A detailed overview of future events can be triggered via touch or externally (for example a proximity sensor or button).

This project uses Microsoft Active Directory/Outlook for the room information and pubnub for subscribing to the proximity information.

## Configuration

For development, copy `.env.example` to `.env` and fill it up accordingly.

For production, set these variables in your running environment.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
