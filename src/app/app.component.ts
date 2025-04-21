import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  //LOGIN
  vistaActual: string = 'login';
  usuario: string = '';
  contrasena: string = '';
  usuarioActual: string = '';

  iniciarSesion() {
    // Buscar en docentes
    const docente = this.docentes.find(
      (doc) =>
        doc.usuario === this.usuario && doc.contrasena === this.contrasena
    );

    if (docente) {
      this.usuarioActual = docente.usuario;
      this.cedulaDocenteActual = docente.cedula;
      this.esAdmin = docente.admin;
    
      this.vistaActual = 'admin'; 
      return;
    }

    // Buscar en estudiantes
    const estudiante = this.estudiantes.find(
      (est) =>
        est.usuario === this.usuario && est.contrasena === this.contrasena
    );

    if (estudiante) {
      this.usuarioActual = estudiante.usuario; // guarda el usuario logueado
      this.vistaActual = 'estudiante';
      return;
    }

    // Si no encuentra nada
    alert('Usuario o contraseña incorrectos.');
  }
  //LOGIN

  //MENU ADMIN
  cambiarVista(vista: string) {
    this.vistaActual = vista;
    this.limpiarvistas();
  }
  //MENU ADMIN

  //REGISTRAR
  nuevoDocente = {
    nombre: '',
    email: '',
    cedula: '',
    admin: false,
    usuario: '',
    contrasena: '',
    celular: '',
  };
  nuevoEstudiante = {
    nombre: '',
    fechaInicio: '',
    cedula: '',
    usuario: '',
    contrasena: '',
    grado: 0,
    docenteCedula: '',
    tipoDocumento: ''
  };

  docentes: any[] = [
    {
      nombre: 'admin',
      email: '',
      cedula: 'admin',
      admin: true,
      usuario: 'admin',
      contrasena: 'admin',
    },
    {
      nombre: 'docente',
      email: '',
      cedula: 'docente',
      admin: false,
      usuario: 'docente',
      contrasena: 'docente',
    },
  ];
  estudiantes: any[] = [
    {
      nombre: 'juan',
      fechaInicio: new Date(),
      usuario: 'juan',
      contrasena: 'juan',
      cedula: 1017257566,
      grado: 10,
      docenteCedula: 'admin',
    },
  ];

  registrarDocente() {
    const cedulaValida = /^\d{6,10}$/.test(String(this.nuevoDocente.cedula));
    const celularValido = /^3[0-9]{9}$/.test(this.nuevoDocente.celular);
    const emailValido = this.validarEmail(this.nuevoDocente.email);
    
    let errores = [];
    
    if (!cedulaValida) {
      errores.push('Cédula inválida (debe tener entre 6 y 10 dígitos).');
    }

    const docente = this.docentes.find(
      (doc) =>
        doc.usuario === this.nuevoDocente.usuario ||
        doc.cedula === this.nuevoDocente.cedula
    );

    const estudiante = this.estudiantes.find(
      (doc) =>
        doc.usuario === this.nuevoDocente.usuario ||
        doc.cedula === this.nuevoDocente.cedula
    );

    if (docente || estudiante) {
      alert('El usuario o cedula ya existe.');
      return;
    }

    if (!this.nuevoDocente.nombre.trim()) {
      errores.push('Nombre requerido.');
    }
    if (!this.nuevoDocente.email.trim()) {
      errores.push('Email requerido.');
    } else if (!emailValido) {
      errores.push('Email inválido.');
    }
    if (!celularValido) {
      errores.push('Celular inválido (debe comenzar por 3 y tener 10 dígitos).');
    }
    if (!this.nuevoDocente.usuario.trim()) {
      errores.push('Usuario requerido.');
    }
    if (!this.nuevoDocente.contrasena.trim()) {
      errores.push('Contraseña requerida.');
    }
    
    if (errores.length > 0) {
      alert('Por favor corrige los siguientes errores:\n\n' + errores.join('\n'));
      return;
    }
    

      this.docentes.push({ ...this.nuevoDocente });

      this.nuevoDocente = {
        cedula: '',
        nombre: '',
        email: '',
        admin: false,
        usuario: '',
        contrasena: '',
        celular: '',
      };
      alert('Docente registrado exitosamente.');
      console.log(this.docentes);

  }

  validarEmail(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  hoy: string = new Date().toISOString().split('T')[0];

  registrarEstudiante() {
    const errores: string[] = [];
  
    const cedulaValida = /^\d{6,10}$/.test(String(this.nuevoEstudiante.cedula));
    const gradoValido =
      this.nuevoEstudiante.grado >= 10 && this.nuevoEstudiante.grado <= 11;
    const fechaValida = !!this.nuevoEstudiante.fechaInicio?.trim();
    const nombreValido = !!this.nuevoEstudiante.nombre?.trim();
    const usuarioValido = !!this.nuevoEstudiante.usuario?.trim();
    const contrasenaValida = !!this.nuevoEstudiante.contrasena?.trim();
    const tipoDoc = this.nuevoEstudiante.tipoDocumento;
  
    if (!tipoDoc) errores.push('Debe seleccionar el tipo de documento.');
    if (!cedulaValida) errores.push('Número de documento inválido.');
    if (!nombreValido) errores.push('El nombre es requerido.');
    if (!fechaValida) errores.push('La fecha de inicio es requerida.');
    if (!gradoValido) errores.push('El grado debe estar entre 10 y 11.');
    if (!usuarioValido) errores.push('El usuario es requerido.');
    if (!contrasenaValida) errores.push('La contraseña es requerida.');
  
    if (
      tipoDoc === 'CC' &&
      this.docentes.some(doc => doc.cedula === this.nuevoEstudiante.cedula)
    ) {
      errores.push('No se puede usar una cédula de ciudadanía ya registrada por un docente.');
    }
  
    if (errores.length > 0) {
      alert('Por favor corrige los siguientes errores:\n\n' + errores.join('\n'));
      return;
    }
  
    const usuarioYaExiste = this.docentes.some(doc => doc.usuario === this.nuevoEstudiante.usuario) ||
                            this.estudiantes.some(est => est.usuario === this.nuevoEstudiante.usuario);
  
    const cedulaYaExiste = this.estudiantes.some(est => est.cedula === this.nuevoEstudiante.cedula);
  
    if (usuarioYaExiste || cedulaYaExiste) {
      alert('El usuario o número de documento ya está registrado.');
      return;
    }
  
    this.estudiantes.push({ ...this.nuevoEstudiante });
  
    this.nuevoEstudiante = {
      nombre: '',
      fechaInicio: '',
      usuario: '',
      contrasena: '',
      cedula: '',
      grado: 0,
      docenteCedula: '',
      tipoDocumento: ''
    };
  
    alert('Estudiante registrado exitosamente.');
  }
  

  //REGISTRAR

  nuevaActividad = {
    codigo: '',
    nombre: '',
    area: '',
    descripcion: '',
  };

  actividades: any[] = [
    {
      codigo: 'ACT001',
      nombre: 'Acompañamiento a adultos mayores',
      area: 'Trabajo Social',
      descripcion: 'El estudiante colabora en actividades recreativas con adultos mayores en un hogar geriátrico.'
    },
    {
      codigo: 'ACT002',
      nombre: 'Jornada de limpieza comunitaria',
      area: 'Medio Ambiente',
      descripcion: 'Apoyo en la recolección de residuos y limpieza de parques o calles del barrio.'
    },
    {
      codigo: 'ACT003',
      nombre: 'Campaña de reciclaje en la institución',
      area: 'Educación Ambiental',
      descripcion: 'Organización de puntos de reciclaje y sensibilización sobre el manejo de residuos.'
    },
    {
      codigo: 'ACT004',
      nombre: 'Apoyo en biblioteca escolar',
      area: 'Institución educativa',
      descripcion: 'Ordenamiento de libros, acompañamiento a lectura guiada con estudiantes de grados inferiores.'
    },
    {
      codigo: 'ACT005',
      nombre: 'Talleres de refuerzo escolar',
      area: 'Educación',
      descripcion: 'Apoyo a estudiantes con bajo rendimiento académico en materias específicas.'
    },
    {
      codigo: 'ACT006',
      nombre: 'Actividades con niños en jardines comunitarios',
      area: 'Infancia y Juventud',
      descripcion: 'Acompañamiento en juegos, lectura y apoyo básico a profesoras en jardín comunitario.'
    },
    {
      codigo: 'ACT007',
      nombre: 'Campaña de sensibilización sobre el uso del agua',
      area: 'Ecología',
      descripcion: 'Creación de carteles, charlas o presentaciones en el colegio sobre ahorro del agua.'
    },
    {
      codigo: 'ACT008',
      nombre: 'Apoyo en comedor comunitario',
      area: 'Ayuda humanitaria',
      descripcion: 'Entrega de alimentos, organización del espacio y acompañamiento a población vulnerable.'
    },
    {
      codigo: 'ACT009',
      nombre: 'Creación de huerta escolar',
      area: 'Ambiente y alimentación',
      descripcion: 'Participación en el diseño, siembra y mantenimiento de una huerta educativa.'
    },
    {
      codigo: 'ACT010',
      nombre: 'Acompañamiento a procesos culturales en el barrio',
      area: 'Cultura y Comunidad',
      descripcion: 'Apoyo en eventos, talleres artísticos o ferias culturales con enfoque social.'
    }
  ];
  

  registrarActividad() {
    const { codigo, nombre, area, descripcion } = this.nuevaActividad;

    // Validar que todos los campos estén llenos
    if (
      !codigo.trim() ||
      !nombre.trim() ||
      !area.trim() ||
      !descripcion.trim()
    ) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Verificar que el código no exista ya
    const codigoExiste = this.actividades.some((act) => act.codigo === codigo);
    if (codigoExiste) {
      alert('El código de actividad ya existe. Debe ser único.');
      return;
    }

    // Guardar la actividad
    this.actividades.push({ ...this.nuevaActividad });
    alert('Actividad registrada correctamente.');
    console.log(this.actividades);

    // Limpiar campos
    this.nuevaActividad = {
      codigo: '',
      nombre: '',
      area: '',
      descripcion: '',
    };
  }

  //ACTIVIDADES

  actividadesRealizadas: any[] = [];

  nuevaActividadRealizada = {
    codigo: '',
    actividad: '', 
    descripcion: '',
    horas: 0,
    aprobado: false,
    estudiante: '',
    razonRechazo: '',
    fecha: null,
    docenteCedula: ''
  };

  todayDate: Date = new Date();
  registrarActividadEstudiante() {
    const { fecha, actividad, descripcion, horas, docenteCedula, estudiante } =
      this.nuevaActividadRealizada;

    if (!actividad || !descripcion.trim() || !docenteCedula || !fecha) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if(!Number.isInteger(horas)){
      alert('No se permiten decimales en las horas');
      return;
    }

    if(horas>12){
      alert('No se permite registrar mas de 12 horas por día.');
      return;
    }

    if(horas<1){
      alert('No se permite registrar valores negativos en las horas');
      return;
    }

    const tieneFechaPermitida = this.estudiantes.some((act) =>  act.usuario === this.usuarioActual && act.fechaInicio > fecha);
    if (tieneFechaPermitida) {
      const estudiante = this.estudiantes.filter((act) =>  act.usuario === this.usuarioActual)[0];

      alert('Ingreso una fecha menor a la fecha de registro, fecha registro: '+ estudiante.fechaInicio);
      return;
    }

    const yaTieneActividadHoy = this.actividadesRealizadas.some(
      (act) => act.estudiante === this.usuarioActual && act.fecha === fecha
    );
    if (yaTieneActividadHoy) {
      alert('Ya registraste una actividad para esta fecha.');
      return;
    }

    if (this.calcularHorasEstudiante() + horas > 80) {
      alert('Esa cantidad de horas excede el límite de 80.');
      return;
    }

    this.actividadesRealizadas.push({
      ...this.nuevaActividadRealizada,
      aprobado: false,
      estudiante: this.usuarioActual,
    });

    alert('Actividad registrada. Esperando aprobación del docente.');

    // Limpiar
    this.nuevaActividadRealizada = {
      codigo: '',
      fecha: null,
      actividad: '',
      descripcion: '',
      horas: 0,
      aprobado: false,
      razonRechazo: '',
      estudiante: '',
      docenteCedula: ''
    };
  }

  get actividadesDelEstudiante() {
    return this.actividadesRealizadas.filter(
      (a) => a.estudiante === this.usuarioActual
    );
  }

  calcularHorasEstudiante(): number {
    return this.actividadesRealizadas
      .filter((act) => act.estudiante === this.usuarioActual && act.aprobado)
      .reduce((total, act) => total + act.horas, 0);
  }

  //DOCENTES ACTIVIDADES:

  cedulaDocenteActual: string = '';
  esAdmin: boolean = false;


// Actividades pendientes de los estudiantes asignados a este docente
actividadesPendientesDocente(): any[] {
  return this.actividadesRealizadas.filter(act =>
    this.cedulaDocenteActual == act.docenteCedula && !act.aprobado && act.razonRechazo === ''
  );
}

// Solo si es admin: actividades de estudiantes que no están asignados al admin
actividadesPendientesOtros(): any[] {
  if (!this.esAdmin) return [];

  return this.actividadesRealizadas.filter(act =>
    this.cedulaDocenteActual != act.docenteCedula && !act.aprobado
  );
}

aprobarActividad(actividad: any) {
  actividad.aprobado = true;
  alert('Actividad aprobada');
}

rechazarActividad(actividad: any) {
  const index = this.actividadesRealizadas.indexOf(actividad);
  if (index > -1) {
    this.actividadesRealizadas.splice(index, 1);
    alert('Actividad rechazada y eliminada');
  }
}

rechazarActividadConRazon(actividad: any) {
  const razon = prompt('¿Por qué estás rechazando esta actividad?');

  if (!razon || razon.trim() === '') {
    alert('Debes escribir una razón para rechazar.');
    return;
  }

  actividad.razonRechazo = razon;
  actividad.aprobado = false;

  alert('Actividad rechazada con observación.');
}



  limpiarvistas() {
    this.nuevoEstudiante = {
      docenteCedula: '',
      nombre: '',
      fechaInicio: '',
      usuario: '',
      contrasena: '',
      cedula: '',
      grado: 0,
      tipoDocumento: ''
    };
    this.nuevoDocente = {
      cedula: '',
      nombre: '',
      email: '',
      admin: false,
      usuario: '',
      contrasena: '',
      celular: '',
    };
    this.nuevaActividad = {
      nombre: '',
      codigo: '',
      area: '',
      descripcion: '',
    };
    this.nuevaActividadRealizada = {
      codigo: '',
      fecha: null,
      actividad: '',
      descripcion: '',
      horas: 0,
      docenteCedula: '',
      aprobado: false,
      razonRechazo: '',
      estudiante: '',
    };
    this.usuario = '';
    this.contrasena = '';
  }
}
