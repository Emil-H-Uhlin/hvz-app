import { GameModel } from "../../models/GameModel";

export default function GamesListItem({game} : { game: GameModel }) {
    return <div>
        <h2>{game.gameName}</h2>
        <p>
            Id={game.id}, Description='{game.description}'
        </p>
    </div>
}