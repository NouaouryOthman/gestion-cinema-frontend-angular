import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';
import {error} from '@angular/compiler/src/util';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes: any;
  public cinemas: any;
  public currentCinema: any;
  public currentVille: any;
  public salles: any;
  public currentProjection: any;
  public selectedTickets: any;

  constructor(public cinemaService: CinemaService) {
  }

  ngOnInit(): void {
    this.cinemaService.getVilles().subscribe(data => {
      this.villes = data;
    }, err => {
      console.log(err);
    });
  }

  onGetCinemas(v: any) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v).subscribe(data => {
      this.cinemas = data;
    }, err => {
      console.log(err);
    });
  }

  onGetSalles(c: any) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c).subscribe(data => {
      this.salles = data;
      this.salles._embedded.salles.forEach((salle: any) => {
        this.cinemaService.getProjection(salle).subscribe(data => {
          salle.projections = data;
        }, err => {
          console.log(err);
        });
      });
    }, error => {
      console.log(error);
    });
  }

  onGetTicketsPlaces(p: any) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p).subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      },
      error => {
        console.log(error);
      });
  }

  onSelectTicket(t: any) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
  }

  getTicketClass(t: any) {
    let str = 'btn ticket ';
    if (t.reserve == true) {
      str += 'btn-danger';
    } else if (t.selected) {
      str += 'btn btn-warning ticket';
    } else {
      str += 'btn-success ticket';
    }
    return str;
  }

  onPayTickets(dataForm: any) {
    let tickets: any;
    tickets = [];
    this.selectedTickets.forEach((t: any) => {
      tickets.push(t.id);
    });
    dataForm.tickets = tickets;
    console.log(dataForm);
    this.cinemaService.payerTickets(dataForm).subscribe((data: any) => {
        alert('Tickets réservés avec succés !');
      },
      error => {
        console.log(error);
      });
  }
}
