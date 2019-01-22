export default function niceRoomName(rawRoomName) {
    if (!rawRoomName) return rawRoomName
    return rawRoomName.replace(/^room(-|–)(ber|muc)(-|–)/i, "")
}
