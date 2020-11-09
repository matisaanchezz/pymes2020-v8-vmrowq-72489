import { Component, OnInit } from '@angular/core';
import { Empresa } from "../../models/empresa";
import { EmpresasService } from "../../services/empresas.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  Titulo = "Empresas";
  TituloAccionABMC = {
    A: "(Agregar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L";
  Mensajes = {
    RD: " Revisar los datos ingresados..."
  };

  Lista: Empresa[] = [];
  FormReg: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private modalDialogService: ModalDialogService,
    private empresasService: EmpresasService
  ) { }

  ngOnInit() {

    this.FormReg = this.formBuilder.group({
      IdEmpresa: [0],
      RazonSocial: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      FechaFundacion: ["",[Validators.required]],
      CantidadEmpleados: [null, [Validators.required]]
    });
    
  }

  GetEmpresa() {
    this.AccionABMC = "L";
    this.empresasService.get().subscribe((res: Empresa[]) => {
      this.Lista = res;
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset({ Activo: true });
    this.submitted = false;
    this.FormReg.markAsUntouched();
  }

  Grabar() {
    this.submitted = true;
    if (this.FormReg.invalid) {
      return;
    }
    const itemCopy = { ...this.FormReg.value };
        
    //convertir fecha de string dd/MM/yyyy a ISO
    var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaFundacion = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();
    
    // agregar post

    if (itemCopy.IdEmpresa == 0 || itemCopy.IdEmpresa == null) {
      itemCopy.IdEmpresa = 0;
      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert("Registro agregado correctamente.");
        this.GetEmpresa();
      });
    }
  }

  Volver() {
    this.AccionABMC = "L";
    this.GetEmpresa();
  }


}