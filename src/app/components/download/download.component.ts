import { Component, Input, SimpleChanges } from '@angular/core';
import { YtsService } from '../../services/yts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-download',
  imports: [FormsModule, CommonModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent {
  @Input() imdbId!: string;
  torrents: any[] = [];
  magnetUrl: string = '';

  constructor(private ytsService: YtsService ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imdbId'] && this.imdbId) {
      this.getTorrent();
    }
  }
  // Método para obtener los torrents desde la API
  getTorrent(): void {
    this.ytsService.getMovieDetails(this.imdbId).subscribe({
      next: (response: any) => {
        if (response && response.data && response.data.movie) {
          const torrents = response.data.movie.torrents;
          if (torrents && torrents.length > 0) {
            console.log('Torrents:', torrents);
            this.torrents = torrents.map((torrent: any) => ({
              quality: torrent.quality,
              size: torrent.size,
              hash: torrent.hash,
              magnetUrl: `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(response.data.movie.title)}&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce`
            }));
          } else {
            console.log('No torrents available.');
          }
        } else {
          console.log('Error: Movie details not found or invalid response.');
        }
      },
      error: (err) => {
        console.error('Error fetching movie details:', err);
      }
    });
  }
  

  downloadTorrent(magnetUrl: string): void {
    if (magnetUrl) {
      console.log('Iniciando descarga desde:', magnetUrl);
      window.location.href = magnetUrl;
    } else {
      console.error('No se ha proporcionado un magnet link.');
    }
  }
}


