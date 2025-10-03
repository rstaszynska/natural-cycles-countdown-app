var yg = Object.defineProperty,
  _g = Object.defineProperties;
var bg = Object.getOwnPropertyDescriptors;
var $u = Object.getOwnPropertySymbols;
var Dg = Object.prototype.hasOwnProperty,
  Eg = Object.prototype.propertyIsEnumerable;
var zu = (e, t, n) =>
    t in e ? yg(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n),
  M = (e, t) => {
    for (var n in (t ||= {})) Dg.call(t, n) && zu(e, n, t[n]);
    if ($u) for (var n of $u(t)) Eg.call(t, n) && zu(e, n, t[n]);
    return e;
  },
  R = (e, t) => _g(e, bg(t));
var An = (e, t, n) =>
  new Promise((r, i) => {
    var o = (l) => {
        try {
          a(n.next(l));
        } catch (c) {
          i(c);
        }
      },
      s = (l) => {
        try {
          a(n.throw(l));
        } catch (c) {
          i(c);
        }
      },
      a = (l) => (l.done ? r(l.value) : Promise.resolve(l.value).then(o, s));
    a((n = n.apply(e, t)).next());
  });
var aa;
function Ri() {
  return aa;
}
function Ye(e) {
  let t = aa;
  return ((aa = e), t);
}
var Gu = Symbol('NotFound');
function Nn(e) {
  return e === Gu || e?.name === '\u0275NotFound';
}
var ce = null,
  Oi = !1,
  la = 1,
  Cg = null,
  J = Symbol('SIGNAL');
function w(e) {
  let t = ce;
  return ((ce = e), t);
}
function Li() {
  return ce;
}
var Gt = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: 'unknown',
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Wt(e) {
  if (Oi) throw new Error('');
  if (ce === null) return;
  ce.consumerOnSignalRead(e);
  let t = ce.producersTail;
  if (t !== void 0 && t.producer === e) return;
  let n,
    r = ce.recomputing;
  if (r && ((n = t !== void 0 ? t.nextProducer : ce.producers), n !== void 0 && n.producer === e)) {
    ((ce.producersTail = n), (n.lastReadVersion = e.version));
    return;
  }
  let i = e.consumersTail;
  if (i !== void 0 && i.consumer === ce && (!r || Ig(i, ce))) return;
  let o = Rn(ce),
    s = {
      producer: e,
      consumer: ce,
      nextProducer: n,
      prevConsumer: i,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  ((ce.producersTail = s), t !== void 0 ? (t.nextProducer = s) : (ce.producers = s), o && Yu(e, s));
}
function Wu() {
  la++;
}
function ji(e) {
  if (!(Rn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === la)) {
    if (!e.producerMustRecompute(e) && !Zt(e)) {
      Pi(e);
      return;
    }
    (e.producerRecomputeValue(e), Pi(e));
  }
}
function ca(e) {
  if (e.consumers === void 0) return;
  let t = Oi;
  Oi = !0;
  try {
    for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
      let r = n.consumer;
      r.dirty || wg(r);
    }
  } finally {
    Oi = t;
  }
}
function ua() {
  return ce?.consumerAllowSignalWrites !== !1;
}
function wg(e) {
  ((e.dirty = !0), ca(e), e.consumerMarkedDirty?.(e));
}
function Pi(e) {
  ((e.dirty = !1), (e.lastCleanEpoch = la));
}
function wt(e) {
  return (e && qu(e), w(e));
}
function qu(e) {
  ((e.producersTail = void 0), (e.recomputing = !0));
}
function qt(e, t) {
  (w(t), e && Zu(e));
}
function Zu(e) {
  e.recomputing = !1;
  let t = e.producersTail,
    n = t !== void 0 ? t.nextProducer : e.producers;
  if (n !== void 0) {
    if (Rn(e))
      do n = da(n);
      while (n !== void 0);
    t !== void 0 ? (t.nextProducer = void 0) : (e.producers = void 0);
  }
}
function Zt(e) {
  for (let t = e.producers; t !== void 0; t = t.nextProducer) {
    let n = t.producer,
      r = t.lastReadVersion;
    if (r !== n.version || (ji(n), r !== n.version)) return !0;
  }
  return !1;
}
function It(e) {
  if (Rn(e)) {
    let t = e.producers;
    for (; t !== void 0; ) t = da(t);
  }
  ((e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0));
}
function Yu(e, t) {
  let n = e.consumersTail,
    r = Rn(e);
  if (
    (n !== void 0
      ? ((t.nextConsumer = n.nextConsumer), (n.nextConsumer = t))
      : ((t.nextConsumer = void 0), (e.consumers = t)),
    (t.prevConsumer = n),
    (e.consumersTail = t),
    !r)
  )
    for (let i = e.producers; i !== void 0; i = i.nextProducer) Yu(i.producer, i);
}
function da(e) {
  let t = e.producer,
    n = e.nextProducer,
    r = e.nextConsumer,
    i = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = i) : (t.consumersTail = i),
    i !== void 0)
  )
    i.nextConsumer = r;
  else if (((t.consumers = r), !Rn(t))) {
    let o = t.producers;
    for (; o !== void 0; ) o = da(o);
  }
  return n;
}
function Rn(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function Vi(e) {
  Cg?.(e);
}
function Ig(e, t) {
  let n = t.producersTail;
  if (n !== void 0) {
    let r = t.producers;
    do {
      if (r === e) return !0;
      if (r === n) break;
      r = r.nextProducer;
    } while (r !== void 0);
  }
  return !1;
}
function Bi(e, t) {
  return Object.is(e, t);
}
function Nr(e, t) {
  let n = Object.create(Mg);
  ((n.computation = e), t !== void 0 && (n.equal = t));
  let r = () => {
    if ((ji(n), Wt(n), n.value === Ar)) throw n.error;
    return n.value;
  };
  return ((r[J] = n), Vi(n), r);
}
var Fi = Symbol('UNSET'),
  ki = Symbol('COMPUTING'),
  Ar = Symbol('ERRORED'),
  Mg = R(M({}, Gt), {
    value: Fi,
    dirty: !0,
    error: null,
    equal: Bi,
    kind: 'computed',
    producerMustRecompute(e) {
      return e.value === Fi || e.value === ki;
    },
    producerRecomputeValue(e) {
      if (e.value === ki) throw new Error('');
      let t = e.value;
      e.value = ki;
      let n = wt(e),
        r,
        i = !1;
      try {
        ((r = e.computation()), w(null), (i = t !== Fi && t !== Ar && r !== Ar && e.equal(t, r)));
      } catch (o) {
        ((r = Ar), (e.error = o));
      } finally {
        qt(e, n);
      }
      if (i) {
        e.value = t;
        return;
      }
      ((e.value = r), e.version++);
    },
  });
function Tg() {
  throw new Error();
}
var Qu = Tg;
function Ku(e) {
  Qu(e);
}
function fa(e) {
  Qu = e;
}
var Sg = null;
function ha(e, t) {
  let n = Object.create(Rr);
  ((n.value = e), t !== void 0 && (n.equal = t));
  let r = () => Xu(n);
  return ((r[J] = n), Vi(n), [r, (s) => On(n, s), (s) => pa(n, s)]);
}
function Xu(e) {
  return (Wt(e), e.value);
}
function On(e, t) {
  (ua() || Ku(e), e.equal(e.value, t) || ((e.value = t), xg(e)));
}
function pa(e, t) {
  (ua() || Ku(e), On(e, t(e.value)));
}
var Rr = R(M({}, Gt), { equal: Bi, value: void 0, kind: 'signal' });
function xg(e) {
  (e.version++, Wu(), ca(e), Sg?.(e));
}
function x(e) {
  return typeof e == 'function';
}
function Ui(e) {
  let n = e((r) => {
    (Error.call(r), (r.stack = new Error().stack));
  });
  return ((n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n);
}
var Hi = Ui(
  (e) =>
    function (n) {
      (e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n));
    },
);
function Yt(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var Z = class e {
  constructor(t) {
    ((this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n))) for (let o of n) o.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (x(r))
        try {
          r();
        } catch (o) {
          t = o instanceof Hi ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Ju(o);
          } catch (s) {
            ((t = t ?? []), s instanceof Hi ? (t = [...t, ...s.errors]) : t.push(s));
          }
      }
      if (t) throw new Hi(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Ju(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && Yt(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    (n && Yt(n, t), t instanceof e && t._removeParent(this));
  }
};
Z.EMPTY = (() => {
  let e = new Z();
  return ((e.closed = !0), e);
})();
var ma = Z.EMPTY;
function $i(e) {
  return e instanceof Z || (e && 'closed' in e && x(e.remove) && x(e.add) && x(e.unsubscribe));
}
function Ju(e) {
  x(e) ? e() : e.unsubscribe();
}
var Pe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Fn = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Fn;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Fn;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function zi(e) {
  Fn.setTimeout(() => {
    let { onUnhandledError: t } = Pe;
    if (t) t(e);
    else throw e;
  });
}
function Or() {}
var ed = ga('C', void 0, void 0);
function td(e) {
  return ga('E', void 0, e);
}
function nd(e) {
  return ga('N', e, void 0);
}
function ga(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Qt = null;
function kn(e) {
  if (Pe.useDeprecatedSynchronousErrorHandling) {
    let t = !Qt;
    if ((t && (Qt = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Qt;
      if (((Qt = null), n)) throw r;
    }
  } else e();
}
function rd(e) {
  Pe.useDeprecatedSynchronousErrorHandling && Qt && ((Qt.errorThrown = !0), (Qt.error = e));
}
var Kt = class extends Z {
    constructor(t) {
      (super(),
        (this.isStopped = !1),
        t ? ((this.destination = t), $i(t) && t.add(this)) : (this.destination = Rg));
    }
    static create(t, n, r) {
      return new ct(t, n, r);
    }
    next(t) {
      this.isStopped ? ya(nd(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped ? ya(td(t), this) : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? ya(ed, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Ag = Function.prototype.bind;
function va(e, t) {
  return Ag.call(e, t);
}
var _a = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Gi(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Gi(r);
        }
      else Gi(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Gi(n);
        }
    }
  },
  ct = class extends Kt {
    constructor(t, n, r) {
      super();
      let i;
      if (x(t) || !t) i = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let o;
        this && Pe.useDeprecatedNextContext
          ? ((o = Object.create(t)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: t.next && va(t.next, o),
              error: t.error && va(t.error, o),
              complete: t.complete && va(t.complete, o),
            }))
          : (i = t);
      }
      this.destination = new _a(i);
    }
  };
function Gi(e) {
  Pe.useDeprecatedSynchronousErrorHandling ? rd(e) : zi(e);
}
function Ng(e) {
  throw e;
}
function ya(e, t) {
  let { onStoppedNotification: n } = Pe;
  n && Fn.setTimeout(() => n(e, t));
}
var Rg = { closed: !0, next: Or, error: Ng, complete: Or };
var Pn = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function Xt(e) {
  return e;
}
function id(e) {
  return e.length === 0
    ? Xt
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, i) => i(r), n);
        };
}
var N = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return ((r.source = this), (r.operator = n), r);
    }
    subscribe(n, r, i) {
      let o = Fg(n) ? n : new ct(n, r, i);
      return (
        kn(() => {
          let { operator: s, source: a } = this;
          o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
        }),
        o
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = od(r)),
        new r((i, o) => {
          let s = new ct({
            next: (a) => {
              try {
                n(a);
              } catch (l) {
                (o(l), s.unsubscribe());
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n);
    }
    [Pn]() {
      return this;
    }
    pipe(...n) {
      return id(n)(this);
    }
    toPromise(n) {
      return (
        (n = od(n)),
        new n((r, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => r(o),
          );
        })
      );
    }
  }
  return ((e.create = (t) => new e(t)), e);
})();
function od(e) {
  var t;
  return (t = e ?? Pe.Promise) !== null && t !== void 0 ? t : Promise;
}
function Og(e) {
  return e && x(e.next) && x(e.error) && x(e.complete);
}
function Fg(e) {
  return (e && e instanceof Kt) || (Og(e) && $i(e));
}
function kg(e) {
  return x(e?.lift);
}
function L(e) {
  return (t) => {
    if (kg(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function B(e, t, n, r, i) {
  return new ba(e, t, n, r, i);
}
var ba = class extends Kt {
  constructor(t, n, r, i, o, s) {
    (super(t),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (l) {
              t.error(l);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (l) {
              t.error(l);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      (super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this)));
    }
  }
};
var sd = Ui(
  (e) =>
    function () {
      (e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed'));
    },
);
var j = (() => {
    class e extends N {
      constructor() {
        (super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null));
      }
      lift(n) {
        let r = new Wi(this, this);
        return ((r.operator = n), r);
      }
      _throwIfClosed() {
        if (this.closed) throw new sd();
      }
      next(n) {
        kn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        kn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ((this.hasError = this.isStopped = !0), (this.thrownError = n));
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        kn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        ((this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null));
      }
      get observed() {
        var n;
        return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
      }
      _trySubscribe(n) {
        return (this._throwIfClosed(), super._trySubscribe(n));
      }
      _subscribe(n) {
        return (this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n));
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: o } = this;
        return r || i
          ? ma
          : ((this.currentObservers = null),
            o.push(n),
            new Z(() => {
              ((this.currentObservers = null), Yt(o, n));
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: o } = this;
        r ? n.error(i) : o && n.complete();
      }
      asObservable() {
        let n = new N();
        return ((n.source = this), n);
      }
    }
    return ((e.create = (t, n) => new Wi(t, n)), e);
  })(),
  Wi = class extends j {
    constructor(t, n) {
      (super(), (this.destination = t), (this.source = n));
    }
    next(t) {
      var n, r;
      (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null &&
        r !== void 0
        ? r
        : ma;
    }
  };
var Ln = class extends j {
  constructor(t) {
    (super(), (this._value = t));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return (!n.closed && t.next(this._value), n);
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return (this._throwIfClosed(), r);
  }
  next(t) {
    super.next((this._value = t));
  }
};
var Fr = {
  now() {
    return (Fr.delegate || Date).now();
  },
  delegate: void 0,
};
var qi = class extends j {
  constructor(t = 1 / 0, n = 1 / 0, r = Fr) {
    (super(),
      (this._bufferSize = t),
      (this._windowTime = n),
      (this._timestampProvider = r),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = n === 1 / 0),
      (this._bufferSize = Math.max(1, t)),
      (this._windowTime = Math.max(1, n)));
  }
  next(t) {
    let {
      isStopped: n,
      _buffer: r,
      _infiniteTimeWindow: i,
      _timestampProvider: o,
      _windowTime: s,
    } = this;
    (n || (r.push(t), !i && r.push(o.now() + s)), this._trimBuffer(), super.next(t));
  }
  _subscribe(t) {
    (this._throwIfClosed(), this._trimBuffer());
    let n = this._innerSubscribe(t),
      { _infiniteTimeWindow: r, _buffer: i } = this,
      o = i.slice();
    for (let s = 0; s < o.length && !t.closed; s += r ? 1 : 2) t.next(o[s]);
    return (this._checkFinalizedStatuses(t), n);
  }
  _trimBuffer() {
    let { _bufferSize: t, _timestampProvider: n, _buffer: r, _infiniteTimeWindow: i } = this,
      o = (i ? 1 : 2) * t;
    if ((t < 1 / 0 && o < r.length && r.splice(0, r.length - o), !i)) {
      let s = n.now(),
        a = 0;
      for (let l = 1; l < r.length && r[l] <= s; l += 2) a = l;
      a && r.splice(0, a + 1);
    }
  }
};
var Zi = class extends Z {
  constructor(t, n) {
    super();
  }
  schedule(t, n = 0) {
    return this;
  }
};
var kr = {
  setInterval(e, t, ...n) {
    let { delegate: r } = kr;
    return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n);
  },
  clearInterval(e) {
    let { delegate: t } = kr;
    return (t?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var Yi = class extends Zi {
  constructor(t, n) {
    (super(t, n), (this.scheduler = t), (this.work = n), (this.pending = !1));
  }
  schedule(t, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = t;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id = (r = this.id) !== null && r !== void 0 ? r : this.requestAsyncId(o, this.id, n)),
      this
    );
  }
  requestAsyncId(t, n, r = 0) {
    return kr.setInterval(t.flush.bind(t, this), r);
  }
  recycleAsyncId(t, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && kr.clearInterval(n);
  }
  execute(t, n) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = !1;
    let r = this._execute(t, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, n) {
    let r = !1,
      i;
    try {
      this.work(t);
    } catch (o) {
      ((r = !0), (i = o || new Error('Scheduled action threw falsy error')));
    }
    if (r) return (this.unsubscribe(), i);
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: n } = this,
        { actions: r } = n;
      ((this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Yt(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe());
    }
  }
};
var jn = class e {
  constructor(t, n = e.now) {
    ((this.schedulerActionCtor = t), (this.now = n));
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
jn.now = Fr.now;
var Qi = class extends jn {
  constructor(t, n = jn.now) {
    (super(t, n), (this.actions = []), (this._active = !1));
  }
  flush(t) {
    let { actions: n } = this;
    if (this._active) {
      n.push(t);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = n.shift()));
    if (((this._active = !1), r)) {
      for (; (t = n.shift()); ) t.unsubscribe();
      throw r;
    }
  }
};
var ad = new Qi(Yi);
var Mt = new N((e) => e.complete());
function ld(e) {
  return e && x(e.schedule);
}
function Da(e) {
  return e[e.length - 1];
}
function Ki(e) {
  return x(Da(e)) ? e.pop() : void 0;
}
function Qe(e) {
  return ld(Da(e)) ? e.pop() : void 0;
}
function cd(e, t) {
  return typeof Da(e) == 'number' ? e.pop() : t;
}
function dd(e, t, n, r) {
  function i(o) {
    return o instanceof n
      ? o
      : new n(function (s) {
          s(o);
        });
  }
  return new (n || (n = Promise))(function (o, s) {
    function a(u) {
      try {
        c(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      try {
        c(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      u.done ? o(u.value) : i(u.value).then(a, l);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
function ud(e) {
  var t = typeof Symbol == 'function' && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e });
      },
    };
  throw new TypeError(t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function Jt(e) {
  return this instanceof Jt ? ((this.v = e), this) : new Jt(e);
}
function fd(e, t, n) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = n.apply(e, t || []),
    i,
    o = [];
  return (
    (i = Object.create((typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype)),
    a('next'),
    a('throw'),
    a('return', s),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    return function (m) {
      return Promise.resolve(m).then(f, d);
    };
  }
  function a(f, m) {
    r[f] &&
      ((i[f] = function (E) {
        return new Promise(function (b, g) {
          o.push([f, E, b, g]) > 1 || l(f, E);
        });
      }),
      m && (i[f] = m(i[f])));
  }
  function l(f, m) {
    try {
      c(r[f](m));
    } catch (E) {
      p(o[0][3], E);
    }
  }
  function c(f) {
    f.value instanceof Jt ? Promise.resolve(f.value.v).then(u, d) : p(o[0][2], f);
  }
  function u(f) {
    l('next', f);
  }
  function d(f) {
    l('throw', f);
  }
  function p(f, m) {
    (f(m), o.shift(), o.length && l(o[0][0], o[0][1]));
  }
}
function hd(e) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof ud == 'function' ? ud(e) : e[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(o) {
    n[o] =
      e[o] &&
      function (s) {
        return new Promise(function (a, l) {
          ((s = e[o](s)), i(a, l, s.done, s.value));
        });
      };
  }
  function i(o, s, a, l) {
    Promise.resolve(l).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var Xi = (e) => e && typeof e.length == 'number' && typeof e != 'function';
function Ji(e) {
  return x(e?.then);
}
function eo(e) {
  return x(e[Pn]);
}
function to(e) {
  return Symbol.asyncIterator && x(e?.[Symbol.asyncIterator]);
}
function no(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Pg() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var ro = Pg();
function io(e) {
  return x(e?.[ro]);
}
function oo(e) {
  return fd(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield Jt(n.read());
        if (i) return yield Jt(void 0);
        yield yield Jt(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function so(e) {
  return x(e?.getReader);
}
function W(e) {
  if (e instanceof N) return e;
  if (e != null) {
    if (eo(e)) return Lg(e);
    if (Xi(e)) return jg(e);
    if (Ji(e)) return Vg(e);
    if (to(e)) return pd(e);
    if (io(e)) return Bg(e);
    if (so(e)) return Ug(e);
  }
  throw no(e);
}
function Lg(e) {
  return new N((t) => {
    let n = e[Pn]();
    if (x(n.subscribe)) return n.subscribe(t);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function jg(e) {
  return new N((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Vg(e) {
  return new N((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, zi);
  });
}
function Bg(e) {
  return new N((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function pd(e) {
  return new N((t) => {
    Hg(e, t).catch((n) => t.error(n));
  });
}
function Ug(e) {
  return pd(oo(e));
}
function Hg(e, t) {
  var n, r, i, o;
  return dd(this, void 0, void 0, function* () {
    try {
      for (n = hd(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        r && !r.done && (o = n.return) && (yield o.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    t.complete();
  });
}
function _e(e, t, n, r = 0, i = !1) {
  let o = t.schedule(function () {
    (n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((e.add(o), !i)) return o;
}
function ao(e, t = 0) {
  return L((n, r) => {
    n.subscribe(
      B(
        r,
        (i) => _e(r, e, () => r.next(i), t),
        () => _e(r, e, () => r.complete(), t),
        (i) => _e(r, e, () => r.error(i), t),
      ),
    );
  });
}
function lo(e, t = 0) {
  return L((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function md(e, t) {
  return W(e).pipe(lo(t), ao(t));
}
function gd(e, t) {
  return W(e).pipe(lo(t), ao(t));
}
function vd(e, t) {
  return new N((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function yd(e, t) {
  return new N((n) => {
    let r;
    return (
      _e(n, t, () => {
        ((r = e[ro]()),
          _e(
            n,
            t,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              o ? n.complete() : n.next(i);
            },
            0,
            !0,
          ));
      }),
      () => x(r?.return) && r.return()
    );
  });
}
function co(e, t) {
  if (!e) throw new Error('Iterable cannot be null');
  return new N((n) => {
    _e(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      _e(
        n,
        t,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function _d(e, t) {
  return co(oo(e), t);
}
function bd(e, t) {
  if (e != null) {
    if (eo(e)) return md(e, t);
    if (Xi(e)) return vd(e, t);
    if (Ji(e)) return gd(e, t);
    if (to(e)) return co(e, t);
    if (io(e)) return yd(e, t);
    if (so(e)) return _d(e, t);
  }
  throw no(e);
}
function we(e, t) {
  return t ? bd(e, t) : W(e);
}
function Vn(...e) {
  let t = Qe(e);
  return we(e, t);
}
function U(e, t) {
  return L((n, r) => {
    let i = 0;
    n.subscribe(
      B(r, (o) => {
        r.next(e.call(t, o, i++));
      }),
    );
  });
}
var { isArray: $g } = Array;
function zg(e, t) {
  return $g(t) ? e(...t) : e(t);
}
function uo(e) {
  return U((t) => zg(e, t));
}
var { isArray: Gg } = Array,
  { getPrototypeOf: Wg, prototype: qg, keys: Zg } = Object;
function fo(e) {
  if (e.length === 1) {
    let t = e[0];
    if (Gg(t)) return { args: t, keys: null };
    if (Yg(t)) {
      let n = Zg(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Yg(e) {
  return e && typeof e == 'object' && Wg(e) === qg;
}
function ho(e, t) {
  return e.reduce((n, r, i) => ((n[r] = t[i]), n), {});
}
function po(...e) {
  let t = Qe(e),
    n = Ki(e),
    { args: r, keys: i } = fo(e);
  if (r.length === 0) return we([], t);
  let o = new N(Qg(r, t, i ? (s) => ho(i, s) : Xt));
  return n ? o.pipe(uo(n)) : o;
}
function Qg(e, t, n = Xt) {
  return (r) => {
    Dd(
      t,
      () => {
        let { length: i } = e,
          o = new Array(i),
          s = i,
          a = i;
        for (let l = 0; l < i; l++)
          Dd(
            t,
            () => {
              let c = we(e[l], t),
                u = !1;
              c.subscribe(
                B(
                  r,
                  (d) => {
                    ((o[l] = d), u || ((u = !0), a--), a || r.next(n(o.slice())));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function Dd(e, t, n) {
  e ? _e(n, e, t) : t();
}
function Ed(e, t, n, r, i, o, s, a) {
  let l = [],
    c = 0,
    u = 0,
    d = !1,
    p = () => {
      d && !l.length && !c && t.complete();
    },
    f = (E) => (c < r ? m(E) : l.push(E)),
    m = (E) => {
      (o && t.next(E), c++);
      let b = !1;
      W(n(E, u++)).subscribe(
        B(
          t,
          (g) => {
            (i?.(g), o ? f(g) : t.next(g));
          },
          () => {
            b = !0;
          },
          void 0,
          () => {
            if (b)
              try {
                for (c--; l.length && c < r; ) {
                  let g = l.shift();
                  s ? _e(t, s, () => m(g)) : m(g);
                }
                p();
              } catch (g) {
                t.error(g);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      B(t, f, () => {
        ((d = !0), p());
      }),
    ),
    () => {
      a?.();
    }
  );
}
function en(e, t, n = 1 / 0) {
  return x(t)
    ? en((r, i) => U((o, s) => t(r, o, i, s))(W(e(r, i))), n)
    : (typeof t == 'number' && (n = t), L((r, i) => Ed(r, i, e, n)));
}
function mo(e = 1 / 0) {
  return en(Xt, e);
}
function Cd() {
  return mo(1);
}
function tn(...e) {
  return Cd()(we(e, Qe(e)));
}
function Ea(...e) {
  let t = Ki(e),
    { args: n, keys: r } = fo(e),
    i = new N((o) => {
      let { length: s } = n;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        l = s,
        c = s;
      for (let u = 0; u < s; u++) {
        let d = !1;
        W(n[u]).subscribe(
          B(
            o,
            (p) => {
              (d || ((d = !0), c--), (a[u] = p));
            },
            () => l--,
            void 0,
            () => {
              (!l || !d) && (c || o.next(r ? ho(r, a) : a), o.complete());
            },
          ),
        );
      }
    });
  return t ? i.pipe(uo(t)) : i;
}
function Ca(...e) {
  let t = Qe(e),
    n = cd(e, 1 / 0),
    r = e;
  return r.length ? (r.length === 1 ? W(r[0]) : mo(n)(we(r, t))) : Mt;
}
function Ke(e, t) {
  return L((n, r) => {
    let i = 0;
    n.subscribe(B(r, (o) => e.call(t, o, i++) && r.next(o)));
  });
}
function go(e, t) {
  return x(t) ? en(e, t, 1) : en(e, 1);
}
function wa(e, t = ad) {
  return L((n, r) => {
    let i = null,
      o = null,
      s = null,
      a = () => {
        if (i) {
          (i.unsubscribe(), (i = null));
          let c = o;
          ((o = null), r.next(c));
        }
      };
    function l() {
      let c = s + e,
        u = t.now();
      if (u < c) {
        ((i = this.schedule(void 0, c - u)), r.add(i));
        return;
      }
      a();
    }
    n.subscribe(
      B(
        r,
        (c) => {
          ((o = c), (s = t.now()), i || ((i = t.schedule(l, e)), r.add(i)));
        },
        () => {
          (a(), r.complete());
        },
        void 0,
        () => {
          o = i = null;
        },
      ),
    );
  });
}
function vo(e) {
  return e <= 0
    ? () => Mt
    : L((t, n) => {
        let r = 0;
        t.subscribe(
          B(n, (i) => {
            ++r <= e && (n.next(i), e <= r && n.complete());
          }),
        );
      });
}
function yo(e) {
  return L((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Ia() {
  return L((e, t) => {
    let n,
      r = !1;
    e.subscribe(
      B(t, (i) => {
        let o = n;
        ((n = i), r && t.next([o, i]), (r = !0));
      }),
    );
  });
}
function wd(e = {}) {
  let {
    connector: t = () => new j(),
    resetOnError: n = !0,
    resetOnComplete: r = !0,
    resetOnRefCountZero: i = !0,
  } = e;
  return (o) => {
    let s,
      a,
      l,
      c = 0,
      u = !1,
      d = !1,
      p = () => {
        (a?.unsubscribe(), (a = void 0));
      },
      f = () => {
        (p(), (s = l = void 0), (u = d = !1));
      },
      m = () => {
        let E = s;
        (f(), E?.unsubscribe());
      };
    return L((E, b) => {
      (c++, !d && !u && p());
      let g = (l = l ?? t());
      (b.add(() => {
        (c--, c === 0 && !d && !u && (a = Ma(m, i)));
      }),
        g.subscribe(b),
        !s &&
          c > 0 &&
          ((s = new ct({
            next: (K) => g.next(K),
            error: (K) => {
              ((d = !0), p(), (a = Ma(f, n, K)), g.error(K));
            },
            complete: () => {
              ((u = !0), p(), (a = Ma(f, r)), g.complete());
            },
          })),
          W(E).subscribe(s)));
    })(o);
  };
}
function Ma(e, t, ...n) {
  if (t === !0) {
    e();
    return;
  }
  if (t === !1) return;
  let r = new ct({
    next: () => {
      (r.unsubscribe(), e());
    },
  });
  return W(t(...n)).subscribe(r);
}
function Ta(e, t, n) {
  let r,
    i = !1;
  return (
    e && typeof e == 'object'
      ? ({ bufferSize: r = 1 / 0, windowTime: t = 1 / 0, refCount: i = !1, scheduler: n } = e)
      : (r = e ?? 1 / 0),
    wd({
      connector: () => new qi(r, t, n),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: i,
    })
  );
}
function Sa(e) {
  return Ke((t, n) => e <= n);
}
function Bn(...e) {
  let t = Qe(e);
  return L((n, r) => {
    (t ? tn(e, n, t) : tn(e, n)).subscribe(r);
  });
}
function _o(e, t) {
  return L((n, r) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && r.complete();
    n.subscribe(
      B(
        r,
        (l) => {
          i?.unsubscribe();
          let c = 0,
            u = o++;
          W(e(l, u)).subscribe(
            (i = B(
              r,
              (d) => r.next(t ? t(l, d, u, c++) : d),
              () => {
                ((i = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function Tt(e) {
  return L((t, n) => {
    (W(e).subscribe(B(n, () => n.complete(), Or)), !n.closed && t.subscribe(n));
  });
}
function Id(e) {
  let t = w(null);
  try {
    return e();
  } finally {
    w(t);
  }
}
var Md = R(M({}, Gt), {
  consumerIsAlwaysLive: !0,
  consumerAllowSignalWrites: !0,
  dirty: !0,
  kind: 'effect',
});
function Td(e) {
  if (((e.dirty = !1), e.version > 0 && !Zt(e))) return;
  e.version++;
  let t = wt(e);
  try {
    (e.cleanup(), e.fn());
  } finally {
    qt(e, t);
  }
}
var Ba = 'https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss',
  y = class extends Error {
    code;
    constructor(t, n) {
      (super($n(t, n)), (this.code = t));
    }
  };
function Kg(e) {
  return `NG0${Math.abs(e)}`;
}
function $n(e, t) {
  return `${Kg(e)}${t ? ': ' + t : ''}`;
}
function F(e) {
  for (let t in e) if (e[t] === F) return t;
  throw Error('');
}
function Ad(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function St(e) {
  if (typeof e == 'string') return e;
  if (Array.isArray(e)) return `[${e.map(St).join(', ')}]`;
  if (e == null) return '' + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return '' + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function Ua(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || '';
}
var Xg = F({ __forward_ref__: F });
function an(e) {
  return (
    (e.__forward_ref__ = an),
    (e.toString = function () {
      return St(this());
    }),
    e
  );
}
function ue(e) {
  return Nd(e) ? e() : e;
}
function Nd(e) {
  return typeof e == 'function' && e.hasOwnProperty(Xg) && e.__forward_ref__ === an;
}
function _(e) {
  return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
}
function Y(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Co(e) {
  return Jg(e, wo);
}
function Jg(e, t) {
  return (e.hasOwnProperty(t) && e[t]) || null;
}
function ev(e) {
  let t = e?.[wo] ?? null;
  return t || null;
}
function Aa(e) {
  return e && e.hasOwnProperty(Do) ? e[Do] : null;
}
var wo = F({ ɵprov: F }),
  Do = F({ ɵinj: F }),
  v = class {
    _desc;
    ngMetadataName = 'InjectionToken';
    ɵprov;
    constructor(t, n) {
      ((this._desc = t),
        (this.ɵprov = void 0),
        typeof n == 'number'
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = _({
              token: this,
              providedIn: n.providedIn || 'root',
              factory: n.factory,
            })));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Ha(e) {
  return e && !!e.ɵproviders;
}
var $a = F({ ɵcmp: F }),
  za = F({ ɵdir: F }),
  Ga = F({ ɵpipe: F });
var Na = F({ ɵfac: F }),
  ln = F({ __NG_ELEMENT_ID__: F }),
  Sd = F({ __NG_ENV_ID__: F });
function Io(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e);
}
function Rd(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : Io(e);
}
var Od = F({ ngErrorCode: F }),
  tv = F({ ngErrorMessage: F }),
  nv = F({ ngTokenPath: F });
function Wa(e, t) {
  return Fd('', -200, t);
}
function Mo(e, t) {
  throw new y(-201, !1);
}
function Fd(e, t, n) {
  let r = new y(t, e);
  return ((r[Od] = t), (r[tv] = e), n && (r[nv] = n), r);
}
function rv(e) {
  return e[Od];
}
var Ra;
function kd() {
  return Ra;
}
function Ie(e) {
  let t = Ra;
  return ((Ra = e), t);
}
function qa(e, t, n) {
  let r = Co(e);
  if (r && r.providedIn == 'root') return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & 8) return null;
  if (t !== void 0) return t;
  Mo(e, 'Injector');
}
var iv = {},
  nn = iv,
  ov = '__NG_DI_FLAG__',
  Oa = class {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, n) {
      let r = rn(n) || 0;
      try {
        return this.injector.get(t, r & 8 ? null : nn, r);
      } catch (i) {
        if (Nn(i)) return i;
        throw i;
      }
    }
  };
function sv(e, t = 0) {
  let n = Ri();
  if (n === void 0) throw new y(-203, !1);
  if (n === null) return qa(e, void 0, t);
  {
    let r = av(t),
      i = n.retrieve(e, r);
    if (Nn(i)) {
      if (r.optional) return null;
      throw i;
    }
    return i;
  }
}
function I(e, t = 0) {
  return (kd() || sv)(ue(e), t);
}
function h(e, t) {
  return I(e, rn(t));
}
function rn(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function av(e) {
  return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) };
}
function Fa(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = ue(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new y(900, !1);
      let i,
        o = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          l = lv(a);
        typeof l == 'number' ? (l === -1 ? (i = a.token) : (o |= l)) : (i = a);
      }
      t.push(I(i, o));
    } else t.push(I(r));
  }
  return t;
}
function lv(e) {
  return e[ov];
}
function Hn(e, t) {
  let n = e.hasOwnProperty(Na);
  return n ? e[Na] : null;
}
function Pd(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let i = e[r],
      o = t[r];
    if ((n && ((i = n(i)), (o = n(o))), o !== i)) return !1;
  }
  return !0;
}
function Ld(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function To(e, t) {
  e.forEach((n) => (Array.isArray(n) ? To(n, t) : t(n)));
}
function Za(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Vr(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function jd(e, t) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(t);
  return n;
}
function Vd(e, t, n, r) {
  let i = e.length;
  if (i == t) e.push(n, r);
  else if (i === 1) (e.push(r, e[0]), (e[0] = n));
  else {
    for (i--, e.push(e[i - 1], e[i]); i > t; ) {
      let o = i - 2;
      ((e[i] = e[o]), i--);
    }
    ((e[t] = n), (e[t + 1] = r));
  }
}
function Bd(e, t, n) {
  let r = zn(e, t);
  return (r >= 0 ? (e[r | 1] = n) : ((r = ~r), Vd(e, r, t, n)), r);
}
function So(e, t) {
  let n = zn(e, t);
  if (n >= 0) return e[n | 1];
}
function zn(e, t) {
  return cv(e, t, 1);
}
function cv(e, t, n) {
  let r = 0,
    i = e.length >> n;
  for (; i !== r; ) {
    let o = r + ((i - r) >> 1),
      s = e[o << n];
    if (t === s) return o << n;
    s > t ? (i = o) : (r = o + 1);
  }
  return ~(i << n);
}
var At = {},
  be = [],
  cn = new v(''),
  Ya = new v('', -1),
  Qa = new v(''),
  Lr = class {
    get(t, n = nn) {
      if (n === nn) {
        let i = Fd('', -201);
        throw ((i.name = '\u0275NotFound'), i);
      }
      return n;
    }
  };
function Nt(e) {
  return e[$a] || null;
}
function Ka(e) {
  return e[za] || null;
}
function Ud(e) {
  return e[Ga] || null;
}
function xo(e) {
  return { ɵproviders: e };
}
function Hd(...e) {
  return { ɵproviders: Xa(!0, e), ɵfromNgModule: !0 };
}
function Xa(e, ...t) {
  let n = [],
    r = new Set(),
    i,
    o = (s) => {
      n.push(s);
    };
  return (
    To(t, (s) => {
      let a = s;
      Eo(a, o, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && $d(i, o),
    n
  );
}
function $d(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: i } = e[n];
    Ja(i, (o) => {
      t(o, r);
    });
  }
}
function Eo(e, t, n, r) {
  if (((e = ue(e)), !e)) return !1;
  let i = null,
    o = Aa(e),
    s = !o && Nt(e);
  if (!o && !s) {
    let l = e.ngModule;
    if (((o = Aa(l)), o)) i = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = e;
  }
  let a = r.has(i);
  if (s) {
    if (a) return !1;
    if ((r.add(i), s.dependencies)) {
      let l = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let c of l) Eo(c, t, n, r);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      r.add(i);
      let c;
      try {
        To(o.imports, (u) => {
          Eo(u, t, n, r) && ((c ||= []), c.push(u));
        });
      } finally {
      }
      c !== void 0 && $d(c, t);
    }
    if (!a) {
      let c = Hn(i) || (() => new i());
      (t({ provide: i, useFactory: c, deps: be }, i),
        t({ provide: Qa, useValue: i, multi: !0 }, i),
        t({ provide: cn, useValue: () => I(i), multi: !0 }, i));
    }
    let l = o.providers;
    if (l != null && !a) {
      let c = e;
      Ja(l, (u) => {
        t(u, c);
      });
    }
  } else return !1;
  return i !== e && e.providers !== void 0;
}
function Ja(e, t) {
  for (let n of e) (Ha(n) && (n = n.ɵproviders), Array.isArray(n) ? Ja(n, t) : t(n));
}
var uv = F({ provide: String, useValue: F });
function zd(e) {
  return e !== null && typeof e == 'object' && uv in e;
}
function dv(e) {
  return !!(e && e.useExisting);
}
function fv(e) {
  return !!(e && e.useFactory);
}
function on(e) {
  return typeof e == 'function';
}
function Gd(e) {
  return !!e.useClass;
}
var Br = new v(''),
  bo = {},
  xd = {},
  xa;
function Gn() {
  return (xa === void 0 && (xa = new Lr()), xa);
}
var ee = class {},
  sn = class extends ee {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, i) {
      (super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        Pa(t, (s) => this.processProvider(s)),
        this.records.set(Ya, Un(void 0, this)),
        i.has('environment') && this.records.set(ee, Un(void 0, this)));
      let o = this.records.get(Br);
      (o != null && typeof o.value == 'string' && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Qa, be, { self: !0 }))));
    }
    retrieve(t, n) {
      let r = rn(n) || 0;
      try {
        return this.get(t, nn, r);
      } catch (i) {
        if (Nn(i)) return i;
        throw i;
      }
    }
    destroy() {
      (Pr(this), (this._destroyed = !0));
      let t = w(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        (this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), w(t));
      }
    }
    onDestroy(t) {
      return (Pr(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t));
    }
    runInContext(t) {
      Pr(this);
      let n = Ye(this),
        r = Ie(void 0),
        i;
      try {
        return t();
      } finally {
        (Ye(n), Ie(r));
      }
    }
    get(t, n = nn, r) {
      if ((Pr(this), t.hasOwnProperty(Sd))) return t[Sd](this);
      let i = rn(r),
        o,
        s = Ye(this),
        a = Ie(void 0);
      try {
        if (!(i & 4)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let u = vv(t) && Co(t);
            (u && this.injectableDefInScope(u) ? (c = Un(ka(t), bo)) : (c = null),
              this.records.set(t, c));
          }
          if (c != null) return this.hydrate(t, c, i);
        }
        let l = i & 2 ? Gn() : this.parent;
        return ((n = i & 8 && n === nn ? null : n), l.get(t, n));
      } catch (l) {
        let c = rv(l);
        throw c === -200 || c === -201 ? new y(c, null) : l;
      } finally {
        (Ie(a), Ye(s));
      }
    }
    resolveInjectorInitializers() {
      let t = w(null),
        n = Ye(this),
        r = Ie(void 0),
        i;
      try {
        let o = this.get(cn, be, { self: !0 });
        for (let s of o) s();
      } finally {
        (Ye(n), Ie(r), w(t));
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(St(r));
      return `R3Injector[${t.join(', ')}]`;
    }
    processProvider(t) {
      t = ue(t);
      let n = on(t) ? t : ue(t && t.provide),
        r = pv(t);
      if (!on(t) && t.multi === !0) {
        let i = this.records.get(n);
        (i || ((i = Un(void 0, bo, !0)), (i.factory = () => Fa(i.multi)), this.records.set(n, i)),
          (n = t),
          i.multi.push(t));
      }
      this.records.set(n, r);
    }
    hydrate(t, n, r) {
      let i = w(null);
      try {
        if (n.value === xd) throw Wa(St(t));
        return (
          n.value === bo && ((n.value = xd), (n.value = n.factory(void 0, r))),
          typeof n.value == 'object' &&
            n.value &&
            gv(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        w(i);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = ue(t.providedIn);
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function ka(e) {
  let t = Co(e),
    n = t !== null ? t.factory : Hn(e);
  if (n !== null) return n;
  if (e instanceof v) throw new y(204, !1);
  if (e instanceof Function) return hv(e);
  throw new y(204, !1);
}
function hv(e) {
  if (e.length > 0) throw new y(204, !1);
  let n = ev(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function pv(e) {
  if (zd(e)) return Un(void 0, e.useValue);
  {
    let t = el(e);
    return Un(t, bo);
  }
}
function el(e, t, n) {
  let r;
  if (on(e)) {
    let i = ue(e);
    return Hn(i) || ka(i);
  } else if (zd(e)) r = () => ue(e.useValue);
  else if (fv(e)) r = () => e.useFactory(...Fa(e.deps || []));
  else if (dv(e)) r = (i, o) => I(ue(e.useExisting), o !== void 0 && o & 8 ? 8 : void 0);
  else {
    let i = ue(e && (e.useClass || e.provide));
    if (mv(e)) r = () => new i(...Fa(e.deps));
    else return Hn(i) || ka(i);
  }
  return r;
}
function Pr(e) {
  if (e.destroyed) throw new y(205, !1);
}
function Un(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function mv(e) {
  return !!e.deps;
}
function gv(e) {
  return e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function';
}
function vv(e) {
  return typeof e == 'function' || (typeof e == 'object' && e.ngMetadataName === 'InjectionToken');
}
function Pa(e, t) {
  for (let n of e) Array.isArray(n) ? Pa(n, t) : n && Ha(n) ? Pa(n.ɵproviders, t) : t(n);
}
function un(e, t) {
  let n;
  e instanceof sn ? (Pr(e), (n = e)) : (n = new Oa(e));
  let r,
    i = Ye(n),
    o = Ie(void 0);
  try {
    return t();
  } finally {
    (Ye(i), Ie(o));
  }
}
function Wd() {
  return kd() !== void 0 || Ri() != null;
}
var Le = 0,
  D = 1,
  C = 2,
  ie = 3,
  Ae = 4,
  pe = 5,
  Wn = 6,
  qn = 7,
  se = 8,
  Zn = 9,
  dt = 10,
  H = 11,
  Yn = 12,
  tl = 13,
  dn = 14,
  Ee = 15,
  Rt = 16,
  fn = 17,
  Xe = 18,
  Ur = 19,
  nl = 20,
  ut = 21,
  Ao = 22,
  ft = 23,
  Me = 24,
  hn = 25,
  me = 26,
  q = 27,
  qd = 1;
var Ot = 7,
  Hr = 8,
  pn = 9,
  de = 10;
function Je(e) {
  return Array.isArray(e) && typeof e[qd] == 'object';
}
function je(e) {
  return Array.isArray(e) && e[qd] === !0;
}
function rl(e) {
  return (e.flags & 4) !== 0;
}
function Ft(e) {
  return e.componentOffset > -1;
}
function Qn(e) {
  return (e.flags & 1) === 1;
}
function et(e) {
  return !!e.template;
}
function Kn(e) {
  return (e[C] & 512) !== 0;
}
function mn(e) {
  return (e[C] & 256) === 256;
}
var Zd = 'svg',
  Yd = 'math';
function Ne(e) {
  for (; Array.isArray(e); ) e = e[Le];
  return e;
}
function il(e, t) {
  return Ne(t[e]);
}
function Ve(e, t) {
  return Ne(t[e.index]);
}
function $r(e, t) {
  return e.data[t];
}
function Qd(e, t) {
  return e[t];
}
function Re(e, t) {
  let n = t[e];
  return Je(n) ? n : n[Le];
}
function Kd(e) {
  return (e[C] & 4) === 4;
}
function No(e) {
  return (e[C] & 128) === 128;
}
function Xd(e) {
  return je(e[ie]);
}
function tt(e, t) {
  return t == null ? null : e[t];
}
function ol(e) {
  e[fn] = 0;
}
function sl(e) {
  e[C] & 1024 || ((e[C] |= 1024), No(e) && kt(e));
}
function Jd(e, t) {
  for (; e > 0; ) ((t = t[dn]), e--);
  return t;
}
function zr(e) {
  return !!(e[C] & 9216 || e[Me]?.dirty);
}
function Ro(e) {
  (e[dt].changeDetectionScheduler?.notify(8), e[C] & 64 && (e[C] |= 1024), zr(e) && kt(e));
}
function kt(e) {
  e[dt].changeDetectionScheduler?.notify(0);
  let t = xt(e);
  for (; t !== null && !(t[C] & 8192 || ((t[C] |= 8192), !No(t))); ) t = xt(t);
}
function al(e, t) {
  if (mn(e)) throw new y(911, !1);
  (e[ut] === null && (e[ut] = []), e[ut].push(t));
}
function ef(e, t) {
  if (e[ut] === null) return;
  let n = e[ut].indexOf(t);
  n !== -1 && e[ut].splice(n, 1);
}
function xt(e) {
  let t = e[ie];
  return je(t) ? t[ie] : t;
}
function ll(e) {
  return (e[qn] ??= []);
}
function cl(e) {
  return (e.cleanup ??= []);
}
function tf(e, t, n, r) {
  let i = ll(t);
  (i.push(n), e.firstCreatePass && cl(e).push(r, i.length - 1));
}
var T = { lFrame: pf(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var La = !1;
function nf() {
  return T.lFrame.elementDepthCount;
}
function rf() {
  T.lFrame.elementDepthCount++;
}
function ul() {
  T.lFrame.elementDepthCount--;
}
function Oo() {
  return T.bindingsEnabled;
}
function dl() {
  return T.skipHydrationRootTNode !== null;
}
function fl(e) {
  return T.skipHydrationRootTNode === e;
}
function hl() {
  T.skipHydrationRootTNode = null;
}
function S() {
  return T.lFrame.lView;
}
function te() {
  return T.lFrame.tView;
}
function gn(e) {
  return ((T.lFrame.contextLView = e), e[se]);
}
function vn(e) {
  return ((T.lFrame.contextLView = null), e);
}
function ae() {
  let e = pl();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function pl() {
  return T.lFrame.currentTNode;
}
function of() {
  let e = T.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Xn(e, t) {
  let n = T.lFrame;
  ((n.currentTNode = e), (n.isParent = t));
}
function ml() {
  return T.lFrame.isParent;
}
function gl() {
  T.lFrame.isParent = !1;
}
function sf() {
  return T.lFrame.contextLView;
}
function vl() {
  return La;
}
function Jn(e) {
  let t = La;
  return ((La = e), t);
}
function af(e) {
  return (T.lFrame.bindingIndex = e);
}
function er() {
  return T.lFrame.bindingIndex++;
}
function lf(e) {
  let t = T.lFrame,
    n = t.bindingIndex;
  return ((t.bindingIndex = t.bindingIndex + e), n);
}
function cf() {
  return T.lFrame.inI18n;
}
function uf(e, t) {
  let n = T.lFrame;
  ((n.bindingIndex = n.bindingRootIndex = e), Fo(t));
}
function df() {
  return T.lFrame.currentDirectiveIndex;
}
function Fo(e) {
  T.lFrame.currentDirectiveIndex = e;
}
function ff(e) {
  let t = T.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function ko() {
  return T.lFrame.currentQueryIndex;
}
function Gr(e) {
  T.lFrame.currentQueryIndex = e;
}
function yv(e) {
  let t = e[D];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[pe] : null;
}
function yl(e, t, n) {
  if (n & 4) {
    let i = t,
      o = e;
    for (; (i = i.parent), i === null && !(n & 1); )
      if (((i = yv(o)), i === null || ((o = o[dn]), i.type & 10))) break;
    if (i === null) return !1;
    ((t = i), (e = o));
  }
  let r = (T.lFrame = hf());
  return ((r.currentTNode = t), (r.lView = e), !0);
}
function Po(e) {
  let t = hf(),
    n = e[D];
  ((T.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1));
}
function hf() {
  let e = T.lFrame,
    t = e === null ? null : e.child;
  return t === null ? pf(e) : t;
}
function pf(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return (e !== null && (e.child = t), t);
}
function mf() {
  let e = T.lFrame;
  return ((T.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e);
}
var _l = mf;
function Lo() {
  let e = mf();
  ((e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0));
}
function gf(e) {
  return (T.lFrame.contextLView = Jd(e, T.lFrame.contextLView))[se];
}
function yn() {
  return T.lFrame.selectedIndex;
}
function Pt(e) {
  T.lFrame.selectedIndex = e;
}
function jo() {
  let e = T.lFrame;
  return $r(e.tView, e.selectedIndex);
}
function vf() {
  return T.lFrame.currentNamespace;
}
var yf = !0;
function Vo() {
  return yf;
}
function Wr(e) {
  yf = e;
}
function ja(e, t = null, n = null, r) {
  let i = _f(e, t, n, r);
  return (i.resolveInjectorInitializers(), i);
}
function _f(e, t = null, n = null, r, i = new Set()) {
  let o = [n || be, Hd(e)];
  return ((r = r || (typeof e == 'object' ? void 0 : St(e))), new sn(o, t || Gn(), r || null, i));
}
var De = class e {
    static THROW_IF_NOT_FOUND = nn;
    static NULL = new Lr();
    static create(t, n) {
      if (Array.isArray(t)) return ja({ name: '' }, n, t, '');
      {
        let r = t.name ?? '';
        return ja({ name: r }, t.parent, t.providers, r);
      }
    }
    static ɵprov = _({ token: e, providedIn: 'any', factory: () => I(Ya) });
    static __NG_ELEMENT_ID__ = -1;
  },
  oe = new v(''),
  Be = (() => {
    class e {
      static __NG_ELEMENT_ID__ = _v;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  jr = class extends Be {
    _lView;
    constructor(t) {
      (super(), (this._lView = t));
    }
    get destroyed() {
      return mn(this._lView);
    }
    onDestroy(t) {
      let n = this._lView;
      return (al(n, t), () => ef(n, t));
    }
  };
function _v() {
  return new jr(S());
}
var Se = class {
    _console = console;
    handleError(t) {
      this._console.error('ERROR', t);
    }
  },
  Ue = new v('', {
    providedIn: 'root',
    factory: () => {
      let e = h(ee),
        t;
      return (n) => {
        e.destroyed && !t
          ? setTimeout(() => {
              throw n;
            })
          : ((t ??= e.get(Se)), t.handleError(n));
      };
    },
  }),
  bf = { provide: cn, useValue: () => void h(Se), multi: !0 };
function Bo(e) {
  return typeof e == 'function' && e[J] !== void 0;
}
function ne(e, t) {
  let [n, r, i] = ha(e, t?.equal),
    o = n,
    s = o[J];
  return ((o.set = r), (o.update = i), (o.asReadonly = bl.bind(o)), o);
}
function bl() {
  let e = this[J];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    ((t[J] = e), (e.readonlyFn = t));
  }
  return e.readonlyFn;
}
var xe = class {},
  Uo = new v('', { providedIn: 'root', factory: () => !1 });
var Dl = new v(''),
  El = new v('');
var tr = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      ((this.view = n), (this.node = r));
    }
    static __NG_ELEMENT_ID__ = bv;
  }
  return e;
})();
function bv() {
  return new tr(S(), ae());
}
var ht = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      destroyed = !1;
      pendingTask = new Ln(!1);
      get hasPendingTasks() {
        return this.destroyed ? !1 : this.pendingTask.value;
      }
      get hasPendingTasksObservable() {
        return this.destroyed
          ? new N((n) => {
              (n.next(!1), n.complete());
            })
          : this.pendingTask;
      }
      add() {
        !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
        let n = this.taskId++;
        return (this.pendingTasks.add(n), n);
      }
      has(n) {
        return this.pendingTasks.has(n);
      }
      remove(n) {
        (this.pendingTasks.delete(n),
          this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1));
      }
      ngOnDestroy() {
        (this.pendingTasks.clear(),
          this.hasPendingTasks && this.pendingTask.next(!1),
          (this.destroyed = !0),
          this.pendingTask.unsubscribe());
      }
      static ɵprov = _({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  qr = (() => {
    class e {
      internalPendingTasks = h(ht);
      scheduler = h(xe);
      errorHandler = h(Ue);
      add() {
        let n = this.internalPendingTasks.add();
        return () => {
          this.internalPendingTasks.has(n) &&
            (this.scheduler.notify(11), this.internalPendingTasks.remove(n));
        };
      }
      run(n) {
        let r = this.add();
        n().catch(this.errorHandler).finally(r);
      }
      static ɵprov = _({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })();
function _n(...e) {}
var Zr = (() => {
    class e {
      static ɵprov = _({ token: e, providedIn: 'root', factory: () => new Va() });
    }
    return e;
  })(),
  Va = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(t) {
      (this.enqueue(t), this.schedule(t));
    }
    schedule(t) {
      t.dirty && this.dirtyEffectCount++;
    }
    remove(t) {
      let n = t.zone,
        r = this.queues.get(n);
      r.has(t) && (r.delete(t), t.dirty && this.dirtyEffectCount--);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || r.add(t);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let t = !1;
        for (let [n, r] of this.queues)
          n === null ? (t ||= this.flushQueue(r)) : (t ||= n.run(() => this.flushQueue(r)));
        t || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(t) {
      let n = !1;
      for (let r of t) r.dirty && (this.dirtyEffectCount--, (n = !0), r.run());
      return n;
    }
  };
function ls(e) {
  return { toString: e }.toString();
}
function Av(e) {
  return typeof e == 'function';
}
var qo = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    ((this.previousValue = t), (this.currentValue = n), (this.firstChange = r));
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Qf(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var it = (() => {
  let e = () => Kf;
  return ((e.ngInherit = !0), e);
})();
function Kf(e) {
  return (e.type.prototype.ngOnChanges && (e.setInput = Rv), Nv);
}
function Nv() {
  let e = Jf(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === At) e.previous = t;
    else for (let r in t) n[r] = t[r];
    ((e.current = null), this.ngOnChanges(t));
  }
}
function Rv(e, t, n, r, i) {
  let o = this.declaredInputs[r],
    s = Jf(e) || Ov(e, { previous: At, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[o];
  ((a[o] = new qo(c && c.currentValue, n, l === At)), Qf(e, t, i, n));
}
var Xf = '__ngSimpleChanges__';
function Jf(e) {
  return e[Xf] || null;
}
function Ov(e, t) {
  return (e[Xf] = t);
}
var Df = [];
var O = function (e, t = null, n) {
  for (let r = 0; r < Df.length; r++) {
    let i = Df[r];
    i(e, t, n);
  }
};
function Fv(e, t, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = t.type.prototype;
  if (r) {
    let s = Kf(t);
    ((n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s));
  }
  (i && (n.preOrderHooks ??= []).push(0 - e, i),
    o && ((n.preOrderHooks ??= []).push(e, o), (n.preOrderCheckHooks ??= []).push(e, o)));
}
function eh(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let o = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: u,
      } = o;
    (s && (e.contentHooks ??= []).push(-n, s),
      a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)),
      l && (e.viewHooks ??= []).push(-n, l),
      c && ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      u != null && (e.destroyHooks ??= []).push(n, u));
  }
}
function $o(e, t, n) {
  th(e, t, 3, n);
}
function zo(e, t, n, r) {
  (e[C] & 3) === n && th(e, t, n, r);
}
function Cl(e, t) {
  let n = e[C];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[C] = n));
}
function th(e, t, n, r) {
  let i = r !== void 0 ? e[fn] & 65535 : 0,
    o = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let l = i; l < s; l++)
    if (typeof t[l + 1] == 'number') {
      if (((a = t[l]), r != null && a >= r)) break;
    } else
      (t[l] < 0 && (e[fn] += 65536),
        (a < o || o == -1) && (kv(e, n, t, l), (e[fn] = (e[fn] & 4294901760) + l + 2)),
        l++);
}
function Ef(e, t) {
  O(4, e, t);
  let n = w(null);
  try {
    t.call(e);
  } finally {
    (w(n), O(5, e, t));
  }
}
function kv(e, t, n, r) {
  let i = n[r] < 0,
    o = n[r + 1],
    s = i ? -n[r] : n[r],
    a = e[s];
  i ? e[C] >> 14 < e[fn] >> 16 && (e[C] & 3) === t && ((e[C] += 16384), Ef(a, o)) : Ef(a, o);
}
var rr = -1,
  Dn = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r, i) {
      ((this.factory = t), (this.name = i), (this.canSeeViewProviders = n), (this.injectImpl = r));
    }
  };
function Pv(e) {
  return (e.flags & 8) !== 0;
}
function Lv(e) {
  return (e.flags & 16) !== 0;
}
function jv(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == 'number') {
      if (i !== 0) break;
      r++;
      let o = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, o);
    } else {
      let o = i,
        s = n[++r];
      (Bv(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s), r++);
    }
  }
  return r;
}
function Vv(e) {
  return e === 3 || e === 4 || e === 6;
}
function Bv(e) {
  return e.charCodeAt(0) === 64;
}
function ir(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let i = t[r];
        typeof i == 'number'
          ? (n = i)
          : n === 0 || (n === -1 || n === 2 ? Cf(e, n, i, null, t[++r]) : Cf(e, n, i, null, null));
      }
    }
  return e;
}
function Cf(e, t, n, r, i) {
  let o = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; o < e.length; ) {
      let a = e[o++];
      if (typeof a == 'number') {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < e.length; ) {
    let a = e[o];
    if (typeof a == 'number') break;
    if (a === n) {
      i !== null && (e[o + 1] = i);
      return;
    }
    (o++, i !== null && o++);
  }
  (s !== -1 && (e.splice(s, 0, t), (o = s + 1)),
    e.splice(o++, 0, n),
    i !== null && e.splice(o++, 0, i));
}
function nh(e) {
  return e !== rr;
}
function Zo(e) {
  return e & 32767;
}
function Uv(e) {
  return e >> 16;
}
function Yo(e, t) {
  let n = Uv(e),
    r = t;
  for (; n > 0; ) ((r = r[dn]), n--);
  return r;
}
var Ol = !0;
function wf(e) {
  let t = Ol;
  return ((Ol = e), t);
}
var Hv = 256,
  rh = Hv - 1,
  ih = 5,
  $v = 0,
  nt = {};
function zv(e, t, n) {
  let r;
  (typeof n == 'string' ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(ln) && (r = n[ln]),
    r == null && (r = n[ln] = $v++));
  let i = r & rh,
    o = 1 << i;
  t.data[e + (i >> ih)] |= o;
}
function Qo(e, t) {
  let n = oh(e, t);
  if (n !== -1) return n;
  let r = t[D];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length), wl(r.data, e), wl(t, null), wl(r.blueprint, null));
  let i = ic(e, t),
    o = e.injectorIndex;
  if (nh(i)) {
    let s = Zo(i),
      a = Yo(i, t),
      l = a[D].data;
    for (let c = 0; c < 8; c++) t[o + c] = a[s + c] | l[s + c];
  }
  return ((t[o + 8] = i), o);
}
function wl(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function oh(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function ic(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    i = t;
  for (; i !== null; ) {
    if (((r = uh(i)), r === null)) return rr;
    if ((n++, (i = i[dn]), r.injectorIndex !== -1)) return r.injectorIndex | (n << 16);
  }
  return rr;
}
function Fl(e, t, n) {
  zv(e, t, n);
}
function sh(e, t, n) {
  if (n & 8 || e !== void 0) return e;
  Mo(t, 'NodeInjector');
}
function ah(e, t, n, r) {
  if ((n & 8 && r === void 0 && (r = null), (n & 3) === 0)) {
    let i = e[Zn],
      o = Ie(void 0);
    try {
      return i ? i.get(t, r, n & 8) : qa(t, r, n & 8);
    } finally {
      Ie(o);
    }
  }
  return sh(r, t, n);
}
function lh(e, t, n, r = 0, i) {
  if (e !== null) {
    if (t[C] & 2048 && !(r & 2)) {
      let s = Zv(e, t, n, r, nt);
      if (s !== nt) return s;
    }
    let o = ch(e, t, n, r, nt);
    if (o !== nt) return o;
  }
  return ah(t, n, r, i);
}
function ch(e, t, n, r, i) {
  let o = Wv(n);
  if (typeof o == 'function') {
    if (!yl(t, e, r)) return r & 1 ? sh(i, n, r) : ah(t, n, r, i);
    try {
      let s;
      if (((s = o(r)), s == null && !(r & 8))) Mo(n);
      else return s;
    } finally {
      _l();
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = oh(e, t),
      l = rr,
      c = r & 1 ? t[Ee][pe] : null;
    for (
      (a === -1 || r & 4) &&
      ((l = a === -1 ? ic(e, t) : t[a + 8]),
      l === rr || !Mf(r, !1) ? (a = -1) : ((s = t[D]), (a = Zo(l)), (t = Yo(l, t))));
      a !== -1;

    ) {
      let u = t[D];
      if (If(o, a, u.data)) {
        let d = Gv(a, t, n, s, r, c);
        if (d !== nt) return d;
      }
      ((l = t[a + 8]),
        l !== rr && Mf(r, t[D].data[a + 8] === c) && If(o, a, t)
          ? ((s = u), (a = Zo(l)), (t = Yo(l, t)))
          : (a = -1));
    }
  }
  return i;
}
function Gv(e, t, n, r, i, o) {
  let s = t[D],
    a = s.data[e + 8],
    l = r == null ? Ft(a) && Ol : r != s && (a.type & 3) !== 0,
    c = i & 1 && o === a,
    u = Go(a, s, n, l, c);
  return u !== null ? Kr(t, s, u, a, i) : nt;
}
function Go(e, t, n, r, i) {
  let o = e.providerIndexes,
    s = t.data,
    a = o & 1048575,
    l = e.directiveStart,
    c = e.directiveEnd,
    u = o >> 20,
    d = r ? a : a + u,
    p = i ? a + u : c;
  for (let f = d; f < p; f++) {
    let m = s[f];
    if ((f < l && n === m) || (f >= l && m.type === n)) return f;
  }
  if (i) {
    let f = s[l];
    if (f && et(f) && f.type === n) return l;
  }
  return null;
}
function Kr(e, t, n, r, i) {
  let o = e[n],
    s = t.data;
  if (o instanceof Dn) {
    let a = o;
    if (a.resolving) {
      let f = Rd(s[n]);
      throw Wa(f);
    }
    let l = wf(a.canSeeViewProviders);
    a.resolving = !0;
    let c = s[n].type || s[n],
      u,
      d = a.injectImpl ? Ie(a.injectImpl) : null,
      p = yl(e, r, 0);
    try {
      ((o = e[n] = a.factory(void 0, i, s, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Fv(n, s[n], t));
    } finally {
      (d !== null && Ie(d), wf(l), (a.resolving = !1), _l());
    }
  }
  return o;
}
function Wv(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(ln) ? e[ln] : void 0;
  return typeof t == 'number' ? (t >= 0 ? t & rh : qv) : t;
}
function If(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> ih)] & r);
}
function Mf(e, t) {
  return !(e & 2) && !(e & 1 && t);
}
var bn = class {
  _tNode;
  _lView;
  constructor(t, n) {
    ((this._tNode = t), (this._lView = n));
  }
  get(t, n, r) {
    return lh(this._tNode, this._lView, t, rn(r), n);
  }
};
function qv() {
  return new bn(ae(), S());
}
function Zv(e, t, n, r, i) {
  let o = e,
    s = t;
  for (; o !== null && s !== null && s[C] & 2048 && !Kn(s); ) {
    let a = ch(o, s, n, r | 2, nt);
    if (a !== nt) return a;
    let l = o.parent;
    if (!l) {
      let c = s[nl];
      if (c) {
        let u = c.get(n, nt, r);
        if (u !== nt) return u;
      }
      ((l = uh(s)), (s = s[dn]));
    }
    o = l;
  }
  return i;
}
function uh(e) {
  let t = e[D],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[pe] : null;
}
function Yv() {
  return lr(ae(), S());
}
function lr(e, t) {
  return new Q(Ve(e, t));
}
var Q = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = Yv;
  }
  return e;
})();
function dh(e) {
  return e instanceof Q ? e.nativeElement : e;
}
function Qv() {
  return this._results[Symbol.iterator]();
}
var Ko = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new j());
  }
  constructor(t = !1) {
    this._emitDistinctChangesOnly = t;
  }
  get(t) {
    return this._results[t];
  }
  map(t) {
    return this._results.map(t);
  }
  filter(t) {
    return this._results.filter(t);
  }
  find(t) {
    return this._results.find(t);
  }
  reduce(t, n) {
    return this._results.reduce(t, n);
  }
  forEach(t) {
    this._results.forEach(t);
  }
  some(t) {
    return this._results.some(t);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(t, n) {
    this.dirty = !1;
    let r = Ld(t);
    (this._changesDetected = !Pd(this._results, r, n)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(t) {
    this._onDirty = t;
  }
  setDirty() {
    ((this.dirty = !0), this._onDirty?.());
  }
  destroy() {
    this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = Qv;
};
function fh(e) {
  return (e.flags & 128) === 128;
}
var oc = (function (e) {
    return ((e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e);
  })(oc || {}),
  hh = new Map(),
  Kv = 0;
function Xv() {
  return Kv++;
}
function Jv(e) {
  hh.set(e[Ur], e);
}
function kl(e) {
  hh.delete(e[Ur]);
}
var Tf = '__ngContext__';
function or(e, t) {
  Je(t) ? ((e[Tf] = t[Ur]), Jv(t)) : (e[Tf] = t);
}
function ph(e) {
  return gh(e[Yn]);
}
function mh(e) {
  return gh(e[Ae]);
}
function gh(e) {
  for (; e !== null && !je(e); ) e = e[Ae];
  return e;
}
var Pl;
function sc(e) {
  Pl = e;
}
function vh() {
  if (Pl !== void 0) return Pl;
  if (typeof document < 'u') return document;
  throw new y(210, !1);
}
var cr = new v('', { providedIn: 'root', factory: () => ey }),
  ey = 'ng',
  cs = new v(''),
  jt = new v('', { providedIn: 'platform', factory: () => 'unknown' });
var ac = new v(''),
  ur = new v('', {
    providedIn: 'root',
    factory: () => vh().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
  });
var ty = 'h',
  ny = 'b';
var yh = !1,
  _h = new v('', { providedIn: 'root', factory: () => yh });
var ry = (e, t, n, r) => {};
function iy(e, t, n, r) {
  ry(e, t, n, r);
}
function us(e) {
  return (e.flags & 32) === 32;
}
var oy = () => null;
function bh(e, t, n = !1) {
  return oy(e, t, n);
}
function Dh(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = w(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let o = n[i],
          s = n[i + 1];
        if (s !== -1) {
          let a = e.data[s];
          (Gr(o), a.contentQueries(2, t[s], s));
        }
      }
    } finally {
      w(r);
    }
  }
}
function Ll(e, t, n) {
  Gr(0);
  let r = w(null);
  try {
    t(e, n);
  } finally {
    w(r);
  }
}
function lc(e, t, n) {
  if (rl(t)) {
    let r = w(null);
    try {
      let i = t.directiveStart,
        o = t.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let l = n[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      w(r);
    }
  }
}
var pt = (function (e) {
  return (
    (e[(e.Emulated = 0)] = 'Emulated'),
    (e[(e.None = 2)] = 'None'),
    (e[(e.ShadowDom = 3)] = 'ShadowDom'),
    e
  );
})(pt || {});
var jl = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ba})`;
  }
};
function Eh(e) {
  return e instanceof jl ? e.changingThisBreaksApplicationSecurity : e;
}
var sy = /^>|^->|<!--|-->|--!>|<!-$/g,
  ay = /(<|>)/g,
  ly = '\u200B$1\u200B';
function cy(e) {
  return e.replace(sy, (t) => t.replace(ay, ly));
}
function uy(e, t, n) {
  let r = e.length;
  for (;;) {
    let i = e.indexOf(t, n);
    if (i === -1) return i;
    if (i === 0 || e.charCodeAt(i - 1) <= 32) {
      let o = t.length;
      if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
    }
    n = i + 1;
  }
}
var Ch = 'ng-template';
function dy(e, t, n, r) {
  let i = 0;
  if (r) {
    for (; i < t.length && typeof t[i] == 'string'; i += 2)
      if (t[i] === 'class' && uy(t[i + 1].toLowerCase(), n, 0) !== -1) return !0;
  } else if (cc(e)) return !1;
  if (((i = t.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < t.length && typeof (o = t[i]) == 'string'; ) if (o.toLowerCase() === n) return !0;
  }
  return !1;
}
function cc(e) {
  return e.type === 4 && e.value !== Ch;
}
function fy(e, t, n) {
  let r = e.type === 4 && !n ? Ch : e.value;
  return t === r;
}
function hy(e, t, n) {
  let r = 4,
    i = e.attrs,
    o = i !== null ? gy(i) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let l = t[a];
    if (typeof l == 'number') {
      if (!s && !He(r) && !He(l)) return !1;
      if (s && He(l)) continue;
      ((s = !1), (r = l | (r & 1)));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (((r = 2 | (r & 1)), (l !== '' && !fy(e, l, n)) || (l === '' && t.length === 1))) {
          if (He(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (i === null || !dy(e, i, l, n)) {
          if (He(r)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          u = py(l, i, cc(e), n);
        if (u === -1) {
          if (He(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== '') {
          let d;
          if ((u > o ? (d = '') : (d = i[u + 1].toLowerCase()), r & 2 && c !== d)) {
            if (He(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return He(r) || s;
}
function He(e) {
  return (e & 1) === 0;
}
function py(e, t, n, r) {
  if (t === null) return -1;
  let i = 0;
  if (r || !n) {
    let o = !1;
    for (; i < t.length; ) {
      let s = t[i];
      if (s === e) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = t[++i];
        for (; typeof a == 'string'; ) a = t[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return vy(t, e);
}
function wh(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (hy(e, t[r], n)) return !0;
  return !1;
}
function my(e) {
  let t = e.attrs;
  if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0) return t[n + 1];
  }
  return null;
}
function gy(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Vv(n)) return t;
  }
  return e.length;
}
function vy(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == 'number') return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function yy(e, t) {
  e: for (let n = 0; n < t.length; n++) {
    let r = t[n];
    if (e.length === r.length) {
      for (let i = 0; i < e.length; i++) if (e[i] !== r[i]) continue e;
      return !0;
    }
  }
  return !1;
}
function Sf(e, t) {
  return e ? ':not(' + t.trim() + ')' : t;
}
function _y(e) {
  let t = e[0],
    n = 1,
    r = 2,
    i = '',
    o = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n];
        i += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else r & 8 ? (i += '.' + s) : r & 4 && (i += ' ' + s);
    else (i !== '' && !He(s) && ((t += Sf(o, i)), (i = '')), (r = s), (o = o || !He(r)));
    n++;
  }
  return (i !== '' && (t += Sf(o, i)), t);
}
function by(e) {
  return e.map(_y).join(',');
}
function Dy(e) {
  let t = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < e.length; ) {
    let o = e[r];
    if (typeof o == 'string') i === 2 ? o !== '' && t.push(o, e[++r]) : i === 8 && n.push(o);
    else {
      if (!He(i)) break;
      i = o;
    }
    r++;
  }
  return (n.length && t.push(1, ...n), t);
}
var gt = {};
function Ey(e, t) {
  return e.createText(t);
}
function Cy(e, t, n) {
  e.setValue(t, n);
}
function wy(e, t) {
  return e.createComment(cy(t));
}
function Ih(e, t, n) {
  return e.createElement(t, n);
}
function Xo(e, t, n, r, i) {
  e.insertBefore(t, n, r, i);
}
function Mh(e, t, n) {
  e.appendChild(t, n);
}
function xf(e, t, n, r, i) {
  r !== null ? Xo(e, t, n, r, i) : Mh(e, t, n);
}
function Iy(e, t, n, r) {
  e.removeChild(null, t, n, r);
}
function My(e, t, n) {
  e.setAttribute(t, 'style', n);
}
function Ty(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n);
}
function Th(e, t, n) {
  let { mergedAttrs: r, classes: i, styles: o } = n;
  (r !== null && jv(e, t, r), i !== null && Ty(e, t, i), o !== null && My(e, t, o));
}
function uc(e, t, n, r, i, o, s, a, l, c, u) {
  let d = q + r,
    p = d + i,
    f = Sy(d, p),
    m = typeof c == 'function' ? c() : c;
  return (f[D] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == 'function' ? o() : o,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: l,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function Sy(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : gt);
  return n;
}
function xy(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = uc(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function dc(e, t, n, r, i, o, s, a, l, c, u) {
  let d = t.blueprint.slice();
  return (
    (d[Le] = i),
    (d[C] = r | 4 | 128 | 8 | 64 | 1024),
    (c !== null || (e && e[C] & 2048)) && (d[C] |= 2048),
    ol(d),
    (d[ie] = d[dn] = e),
    (d[se] = n),
    (d[dt] = s || (e && e[dt])),
    (d[H] = a || (e && e[H])),
    (d[Zn] = l || (e && e[Zn]) || null),
    (d[pe] = o),
    (d[Ur] = Xv()),
    (d[Wn] = u),
    (d[nl] = c),
    (d[Ee] = t.type == 2 ? e[Ee] : d),
    d
  );
}
function Ay(e, t, n) {
  let r = Ve(t, e),
    i = xy(n),
    o = e[dt].rendererFactory,
    s = fc(e, dc(e, i, null, Sh(n), r, t, null, o.createRenderer(r, n), null, null, null));
  return (e[t.index] = s);
}
function Sh(e) {
  let t = 16;
  return (e.signals ? (t = 4096) : e.onPush && (t = 64), t);
}
function xh(e, t, n, r) {
  if (n === 0) return -1;
  let i = t.length;
  for (let o = 0; o < n; o++) (t.push(r), e.blueprint.push(r), e.data.push(null));
  return i;
}
function fc(e, t) {
  return (e[Yn] ? (e[tl][Ae] = t) : (e[Yn] = t), (e[tl] = t), t);
}
function V(e = 1) {
  Ah(te(), S(), yn() + e, !1);
}
function Ah(e, t, n, r) {
  if (!r)
    if ((t[C] & 3) === 3) {
      let o = e.preOrderCheckHooks;
      o !== null && $o(t, o, n);
    } else {
      let o = e.preOrderHooks;
      o !== null && zo(t, o, 0, n);
    }
  Pt(n);
}
var ds = (function (e) {
  return (
    (e[(e.None = 0)] = 'None'),
    (e[(e.SignalBased = 1)] = 'SignalBased'),
    (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
    e
  );
})(ds || {});
function Vl(e, t, n, r) {
  let i = w(null);
  try {
    let [o, s, a] = e.inputs[n],
      l = null;
    ((s & ds.SignalBased) !== 0 && (l = t[o][J]),
      l !== null && l.transformFn !== void 0
        ? (r = l.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, l, r, n, o) : Qf(t, l, o, r));
  } finally {
    w(i);
  }
}
var rt = (function (e) {
    return ((e[(e.Important = 1)] = 'Important'), (e[(e.DashCase = 2)] = 'DashCase'), e);
  })(rt || {}),
  Ny;
function hc(e, t) {
  return Ny(e, t);
}
var fs = new Set();
function nr(e, t, n, r, i, o) {
  if (r != null) {
    let s,
      a = !1;
    je(r) ? (s = r) : Je(r) && ((a = !0), (r = r[Le]));
    let l = Ne(r);
    (e === 0 && n !== null
      ? i == null
        ? Mh(t, n, l)
        : Xo(t, n, l, i || null, !0)
      : e === 1 && n !== null
        ? Xo(t, n, l, i || null, !0)
        : e === 2
          ? Af(o, (c) => {
              Iy(t, l, a, c);
            })
          : e === 3 &&
            Af(o, () => {
              t.destroyNode(l);
            }),
      s != null && Hy(t, e, s, n, i));
  }
}
function Ry(e, t) {
  (Nh(e, t), (t[Le] = null), (t[pe] = null));
}
function Oy(e, t, n, r, i, o) {
  ((r[Le] = i), (r[pe] = t), hs(e, r, n, 1, i, o));
}
function Nh(e, t) {
  (t[dt].changeDetectionScheduler?.notify(9), hs(e, t, t[H], 2, null, null));
}
function Fy(e) {
  let t = e[Yn];
  if (!t) return Il(e[D], e);
  for (; t; ) {
    let n = null;
    if (Je(t)) n = t[Yn];
    else {
      let r = t[de];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[Ae] && t !== e; ) (Je(t) && Il(t[D], t), (t = t[ie]));
      (t === null && (t = e), Je(t) && Il(t[D], t), (n = t && t[Ae]));
    }
    t = n;
  }
}
function pc(e, t) {
  let n = e[pn],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function mc(e, t) {
  if (mn(t)) return;
  let n = t[H];
  (n.destroyNode && hs(e, t, n, 3, null, null), Fy(t));
}
function Il(e, t) {
  if (mn(t)) return;
  let n = w(null);
  try {
    ((t[C] &= -129),
      (t[C] |= 256),
      t[Me] && It(t[Me]),
      Ly(e, t),
      Py(e, t),
      t[D].type === 1 && t[H].destroy());
    let r = t[Rt];
    if (r !== null && je(t[ie])) {
      r !== t[ie] && pc(r, t);
      let i = t[Xe];
      i !== null && i.detachView(e);
    }
    kl(t);
  } finally {
    w(n);
  }
}
function Af(e, t) {
  if (e && e[me] && e[me].leave)
    if (e[me].skipLeaveAnimations) e[me].skipLeaveAnimations = !1;
    else {
      let n = e[me].leave,
        r = [];
      for (let i = 0; i < n.length; i++) {
        let o = n[i];
        r.push(o());
      }
      ((e[me].running = Promise.allSettled(r)), (e[me].leave = void 0));
    }
  ky(e, t);
}
function ky(e, t) {
  if (e && e[me] && e[me].running) {
    e[me].running.then(() => {
      (e[me] && e[me].running && (e[me].running = void 0), fs.delete(e), t(!0));
    });
    return;
  }
  t(!1);
}
function Py(e, t) {
  let n = e.cleanup,
    r = t[qn];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let a = n[s + 3];
        (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[qn] = null);
  let i = t[ut];
  if (i !== null) {
    t[ut] = null;
    for (let s = 0; s < i.length; s++) {
      let a = i[s];
      a();
    }
  }
  let o = t[ft];
  if (o !== null) {
    t[ft] = null;
    for (let s of o) s.destroy();
  }
}
function Ly(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = t[n[r]];
      if (!(i instanceof Dn)) {
        let o = n[r + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              l = o[s + 1];
            O(4, a, l);
            try {
              l.call(a);
            } finally {
              O(5, a, l);
            }
          }
        else {
          O(4, i, o);
          try {
            o.call(i);
          } finally {
            O(5, i, o);
          }
        }
      }
    }
}
function Rh(e, t, n) {
  return jy(e, t.parent, n);
}
function jy(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) ((t = r), (r = t.parent));
  if (r === null) return n[Le];
  if (Ft(r)) {
    let { encapsulation: i } = e.data[r.directiveStart + r.componentOffset];
    if (i === pt.None || i === pt.Emulated) return null;
  }
  return Ve(r, n);
}
function Oh(e, t, n) {
  return By(e, t, n);
}
function Vy(e, t, n) {
  return e.type & 40 ? Ve(e, n) : null;
}
var By = Vy,
  Nf;
function gc(e, t, n, r) {
  let i = Rh(e, r, t),
    o = t[H],
    s = r.parent || t[pe],
    a = Oh(s, r, t);
  if (i != null)
    if (Array.isArray(n)) for (let l = 0; l < n.length; l++) xf(o, i, n[l], a, !1);
    else xf(o, i, n, a, !1);
  Nf !== void 0 && Nf(o, r, t, n, i);
}
function Yr(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return Ve(t, e);
    if (n & 4) return Bl(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Yr(e, r);
      {
        let i = e[t.index];
        return je(i) ? Bl(-1, i) : Ne(i);
      }
    } else {
      if (n & 128) return Yr(e, t.next);
      if (n & 32) return hc(t, e)() || Ne(e[t.index]);
      {
        let r = Fh(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = xt(e[Ee]);
          return Yr(i, r);
        } else return Yr(e, t.next);
      }
    }
  }
  return null;
}
function Fh(e, t) {
  if (t !== null) {
    let r = e[Ee][pe],
      i = t.projection;
    return r.projection[i];
  }
  return null;
}
function Bl(e, t) {
  let n = de + e + 1;
  if (n < t.length) {
    let r = t[n],
      i = r[D].firstChild;
    if (i !== null) return Yr(r, i);
  }
  return t[Ot];
}
function vc(e, t, n, r, i, o, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      l = n.type;
    if ((s && t === 0 && (a && or(Ne(a), r), (n.flags |= 2)), !us(n)))
      if (l & 8) (vc(e, t, n.child, r, i, o, !1), nr(t, e, i, a, o, r));
      else if (l & 32) {
        let c = hc(n, r),
          u;
        for (; (u = c()); ) nr(t, e, i, u, o, r);
        nr(t, e, i, a, o, r);
      } else l & 16 ? kh(e, t, r, n, i, o) : nr(t, e, i, a, o, r);
    n = s ? n.projectionNext : n.next;
  }
}
function hs(e, t, n, r, i, o) {
  vc(n, r, e.firstChild, t, i, o, !1);
}
function Uy(e, t, n) {
  let r = t[H],
    i = Rh(e, n, t),
    o = n.parent || t[pe],
    s = Oh(o, n, t);
  kh(r, 0, t, n, i, s);
}
function kh(e, t, n, r, i, o) {
  let s = n[Ee],
    l = s[pe].projection[r.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let u = l[c];
      nr(t, e, i, u, o, n);
    }
  else {
    let c = l,
      u = s[ie];
    (fh(r) && (c.flags |= 128), vc(e, t, c, u, i, o, !0));
  }
}
function Hy(e, t, n, r, i) {
  let o = n[Ot],
    s = Ne(n);
  o !== s && nr(t, e, r, o, i);
  for (let a = de; a < n.length; a++) {
    let l = n[a];
    hs(l[D], l, e, t, r, o);
  }
}
function $y(e, t, n, r, i) {
  if (t) i ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let o = r.indexOf('-') === -1 ? void 0 : rt.DashCase;
    i == null
      ? e.removeStyle(n, r, o)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (o |= rt.Important)),
        e.setStyle(n, r, i, o));
  }
}
function Ph(e, t, n, r, i) {
  let o = yn(),
    s = r & 2;
  try {
    (Pt(-1), s && t.length > q && Ah(e, t, q, !1), O(s ? 2 : 0, i, n), n(r, i));
  } finally {
    (Pt(o), O(s ? 3 : 1, i, n));
  }
}
function ps(e, t, n) {
  (Qy(e, t, n), (n.flags & 64) === 64 && Ky(e, t, n));
}
function ni(e, t, n = Ve) {
  let r = t.localNames;
  if (r !== null) {
    let i = t.index + 1;
    for (let o = 0; o < r.length; o += 2) {
      let s = r[o + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[i++] = a;
    }
  }
}
function zy(e, t, n, r) {
  let o = r.get(_h, yh) || n === pt.ShadowDom,
    s = e.selectRootElement(t, o);
  return (Gy(s), s);
}
function Gy(e) {
  Wy(e);
}
var Wy = () => null;
function qy(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
      ? 'htmlFor'
      : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
          ? 'innerHTML'
          : e === 'readonly'
            ? 'readOnly'
            : e === 'tabindex'
              ? 'tabIndex'
              : e;
}
function Zy(e, t, n, r, i, o) {
  let s = t[D];
  if (Dc(e, s, t, n, r)) {
    Ft(e) && Yy(t, e.index);
    return;
  }
  (e.type & 3 && (n = qy(n)), Lh(e, t, n, r, i, o));
}
function Lh(e, t, n, r, i, o) {
  if (e.type & 3) {
    let s = Ve(e, t);
    ((r = o != null ? o(r, e.value || '', n) : r), i.setProperty(s, n, r));
  } else e.type & 12;
}
function Yy(e, t) {
  let n = Re(t, e);
  n[C] & 16 || (n[C] |= 64);
}
function Qy(e, t, n) {
  let r = n.directiveStart,
    i = n.directiveEnd;
  (Ft(n) && Ay(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Qo(n, t));
  let o = n.initialInputs;
  for (let s = r; s < i; s++) {
    let a = e.data[s],
      l = Kr(t, e, s, n);
    if ((or(l, t), o !== null && t_(t, s - r, l, a, n, o), et(a))) {
      let c = Re(n.index, t);
      c[se] = Kr(t, e, s, n);
    }
  }
}
function Ky(e, t, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    o = n.index,
    s = df();
  try {
    Pt(o);
    for (let a = r; a < i; a++) {
      let l = e.data[a],
        c = t[a];
      (Fo(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && Xy(l, c));
    }
  } finally {
    (Pt(-1), Fo(s));
  }
}
function Xy(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function yc(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let o = n[i];
      wh(t, o.selectors, !1) && ((r ??= []), et(o) ? r.unshift(o) : r.push(o));
    }
  return r;
}
function Jy(e, t, n, r, i, o) {
  let s = Ve(e, t);
  e_(t[H], s, o, e.value, n, r, i);
}
function e_(e, t, n, r, i, o, s) {
  if (o == null) e.removeAttribute(t, i, n);
  else {
    let a = s == null ? Io(o) : s(o, r || '', i);
    e.setAttribute(t, i, a, n);
  }
}
function t_(e, t, n, r, i, o) {
  let s = o[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let l = s[a],
        c = s[a + 1];
      Vl(r, n, l, c);
    }
}
function _c(e, t, n, r, i) {
  let o = q + n,
    s = t[D],
    a = i(s, t, e, r, n);
  ((t[o] = a), Xn(e, !0));
  let l = e.type === 2;
  return (
    l ? (Th(t[H], a, e), (nf() === 0 || Qn(e)) && or(a, t), rf()) : or(a, t),
    Vo() && (!l || !us(e)) && gc(s, t, a, e),
    e
  );
}
function bc(e) {
  let t = e;
  return (ml() ? gl() : ((t = t.parent), Xn(t, !1)), t);
}
function n_(e, t) {
  let n = e[Zn];
  if (!n) return;
  let r;
  try {
    r = n.get(Ue, null);
  } catch {
    r = null;
  }
  r?.(t);
}
function Dc(e, t, n, r, i) {
  let o = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let l = 0; l < s.length; l += 2) {
      let c = s[l],
        u = s[l + 1],
        d = t.data[c];
      (Vl(d, n[c], u, i), (a = !0));
    }
  if (o)
    for (let l of o) {
      let c = n[l],
        u = t.data[l];
      (Vl(u, c, r, i), (a = !0));
    }
  return a;
}
function r_(e, t) {
  let n = Re(t, e),
    r = n[D];
  i_(r, n);
  let i = n[Le];
  (i !== null && n[Wn] === null && (n[Wn] = bh(i, n[Zn])), O(18), Ec(r, n, n[se]), O(19, n[se]));
}
function i_(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Ec(e, t, n) {
  Po(t);
  try {
    let r = e.viewQuery;
    r !== null && Ll(1, r, n);
    let i = e.template;
    (i !== null && Ph(e, t, i, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Xe]?.finishViewCreation(e),
      e.staticContentQueries && Dh(e, t),
      e.staticViewQueries && Ll(2, e.viewQuery, n));
    let o = e.components;
    o !== null && o_(t, o);
  } catch (r) {
    throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
  } finally {
    ((t[C] &= -5), Lo());
  }
}
function o_(e, t) {
  for (let n = 0; n < t.length; n++) r_(e, t[n]);
}
function Cc(e, t, n, r) {
  let i = w(null);
  try {
    let o = t.tView,
      a = e[C] & 4096 ? 4096 : 16,
      l = dc(
        e,
        o,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      c = e[t.index];
    l[Rt] = c;
    let u = e[Xe];
    return (u !== null && (l[Xe] = u.createEmbeddedView(o)), Ec(o, l, n), l);
  } finally {
    w(i);
  }
}
function Jo(e, t) {
  return !t || t.firstChild === null || fh(e);
}
function Xr(e, t, n, r, i = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = i ? n.projectionNext : n.next;
      continue;
    }
    let o = t[n.index];
    (o !== null && r.push(Ne(o)), je(o) && jh(o, r));
    let s = n.type;
    if (s & 8) Xr(e, t, n.child, r);
    else if (s & 32) {
      let a = hc(n, t),
        l;
      for (; (l = a()); ) r.push(l);
    } else if (s & 16) {
      let a = Fh(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let l = xt(t[Ee]);
        Xr(l[D], l, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function jh(e, t) {
  for (let n = de; n < e.length; n++) {
    let r = e[n],
      i = r[D].firstChild;
    i !== null && Xr(r[D], r, i, t);
  }
  e[Ot] !== e[Le] && t.push(e[Ot]);
}
function Vh(e) {
  if (e[hn] !== null) {
    for (let t of e[hn]) t.impl.addSequence(t);
    e[hn].length = 0;
  }
}
var Bh = [];
function s_(e) {
  return e[Me] ?? a_(e);
}
function a_(e) {
  let t = Bh.pop() ?? Object.create(c_);
  return ((t.lView = e), t);
}
function l_(e) {
  e.lView[Me] !== e && ((e.lView = null), Bh.push(e));
}
var c_ = R(M({}, Gt), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    kt(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[Me] = this;
  },
});
function u_(e) {
  let t = e[Me] ?? Object.create(d_);
  return ((t.lView = e), t);
}
var d_ = R(M({}, Gt), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    let t = xt(e.lView);
    for (; t && !Uh(t[D]); ) t = xt(t);
    t && sl(t);
  },
  consumerOnSignalRead() {
    this.lView[Me] = this;
  },
});
function Uh(e) {
  return e.type !== 2;
}
function Hh(e) {
  if (e[ft] === null) return;
  let t = !0;
  for (; t; ) {
    let n = !1;
    for (let r of e[ft])
      r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
    t = n && !!(e[C] & 8192);
  }
}
var f_ = 100;
function $h(e, t = 0) {
  let r = e[dt].rendererFactory,
    i = !1;
  i || r.begin?.();
  try {
    h_(e, t);
  } finally {
    i || r.end?.();
  }
}
function h_(e, t) {
  let n = vl();
  try {
    (Jn(!0), Ul(e, t));
    let r = 0;
    for (; zr(e); ) {
      if (r === f_) throw new y(103, !1);
      (r++, Ul(e, 1));
    }
  } finally {
    Jn(n);
  }
}
function p_(e, t, n, r) {
  if (mn(t)) return;
  let i = t[C],
    o = !1,
    s = !1;
  Po(t);
  let a = !0,
    l = null,
    c = null;
  o ||
    (Uh(e)
      ? ((c = s_(t)), (l = wt(c)))
      : Li() === null
        ? ((a = !1), (c = u_(t)), (l = wt(c)))
        : t[Me] && (It(t[Me]), (t[Me] = null)));
  try {
    (ol(t), af(e.bindingStartIndex), n !== null && Ph(e, t, n, 2, r), m_(t));
    let u = (i & 3) === 3;
    if (!o)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && $o(t, f, null);
      } else {
        let f = e.preOrderHooks;
        (f !== null && zo(t, f, 0, null), Cl(t, 0));
      }
    if ((s || g_(t), Hh(t), zh(t, 0), e.contentQueries !== null && Dh(e, t), !o))
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && $o(t, f);
      } else {
        let f = e.contentHooks;
        (f !== null && zo(t, f, 1), Cl(t, 1));
      }
    y_(e, t);
    let d = e.components;
    d !== null && Wh(t, d, 0);
    let p = e.viewQuery;
    if ((p !== null && Ll(2, p, r), !o))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && $o(t, f);
      } else {
        let f = e.viewHooks;
        (f !== null && zo(t, f, 2), Cl(t, 2));
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Ao])) {
      for (let f of t[Ao]) f();
      t[Ao] = null;
    }
    o || (Vh(t), (t[C] &= -73));
  } catch (u) {
    throw (o || kt(t), u);
  } finally {
    (c !== null && (qt(c, l), a && l_(c)), Lo());
  }
}
function m_(e) {
  let t = e[me];
  if (t?.enter) {
    for (let n of t.enter) n();
    t.enter = void 0;
  }
}
function zh(e, t) {
  for (let n = ph(e); n !== null; n = mh(n))
    for (let r = de; r < n.length; r++) {
      let i = n[r];
      Gh(i, t);
    }
}
function g_(e) {
  for (let t = ph(e); t !== null; t = mh(t)) {
    if (!(t[C] & 2)) continue;
    let n = t[pn];
    for (let r = 0; r < n.length; r++) {
      let i = n[r];
      sl(i);
    }
  }
}
function v_(e, t, n) {
  O(18);
  let r = Re(t, e);
  (Gh(r, n), O(19, r[se]));
}
function Gh(e, t) {
  No(e) && Ul(e, t);
}
function Ul(e, t) {
  let r = e[D],
    i = e[C],
    o = e[Me],
    s = !!(t === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && t === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && Zt(o))),
    (s ||= !1),
    o && (o.dirty = !1),
    (e[C] &= -9217),
    s)
  )
    p_(r, e, r.template, e[se]);
  else if (i & 8192) {
    let a = w(null);
    try {
      (Hh(e), zh(e, 1));
      let l = r.components;
      (l !== null && Wh(e, l, 1), Vh(e));
    } finally {
      w(a);
    }
  }
}
function Wh(e, t, n) {
  for (let r = 0; r < t.length; r++) v_(e, t[r], n);
}
function y_(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) Pt(~i);
        else {
          let o = i,
            s = n[++r],
            a = n[++r];
          uf(s, o);
          let l = t[o];
          (O(24, l), a(2, l), O(25, l));
        }
      }
    } finally {
      Pt(-1);
    }
}
function wc(e, t) {
  let n = vl() ? 64 : 1088;
  for (e[dt].changeDetectionScheduler?.notify(t); e; ) {
    e[C] |= n;
    let r = xt(e);
    if (Kn(e) && !r) return e;
    e = r;
  }
  return null;
}
function qh(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function __(e, t) {
  let n = de + t;
  if (n < e.length) return e[n];
}
function Ic(e, t, n, r = !0) {
  let i = t[D];
  if ((D_(i, t, e, n), r)) {
    let s = Bl(n, e),
      a = t[H],
      l = a.parentNode(e[Ot]);
    l !== null && Oy(i, e[pe], a, t, l, s);
  }
  let o = t[Wn];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function b_(e, t) {
  let n = es(e, t);
  return (n !== void 0 && mc(n[D], n), n);
}
function es(e, t) {
  if (e.length <= de) return;
  let n = de + t,
    r = e[n];
  if (r) {
    let i = r[Rt];
    (i !== null && i !== e && pc(i, r), t > 0 && (e[n - 1][Ae] = r[Ae]));
    let o = Vr(e, de + t);
    Ry(r[D], r);
    let s = o[Xe];
    (s !== null && s.detachView(o[D]), (r[ie] = null), (r[Ae] = null), (r[C] &= -129));
  }
  return r;
}
function D_(e, t, n, r) {
  let i = de + r,
    o = n.length;
  (r > 0 && (n[i - 1][Ae] = t),
    r < o - de ? ((t[Ae] = n[i]), Za(n, de + r, t)) : (n.push(t), (t[Ae] = null)),
    (t[ie] = n));
  let s = t[Rt];
  s !== null && n !== s && Zh(s, t);
  let a = t[Xe];
  (a !== null && a.insertView(e), Ro(t), (t[C] |= 128));
}
function Zh(e, t) {
  let n = e[pn],
    r = t[ie];
  if (Je(r)) e[C] |= 2;
  else {
    let i = r[ie][Ee];
    t[Ee] !== i && (e[C] |= 2);
  }
  n === null ? (e[pn] = [t]) : n.push(t);
}
var Lt = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let t = this._lView,
      n = t[D];
    return Xr(n, t, n.firstChild, []);
  }
  constructor(t, n) {
    ((this._lView = t), (this._cdRefInjectingView = n));
  }
  get context() {
    return this._lView[se];
  }
  set context(t) {
    this._lView[se] = t;
  }
  get destroyed() {
    return mn(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[ie];
      if (je(t)) {
        let n = t[Hr],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (es(t, r), Vr(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    mc(this._lView[D], this._lView);
  }
  onDestroy(t) {
    al(this._lView, t);
  }
  markForCheck() {
    wc(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[C] &= -129;
  }
  reattach() {
    (Ro(this._lView), (this._lView[C] |= 128));
  }
  detectChanges() {
    ((this._lView[C] |= 1024), $h(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new y(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = Kn(this._lView),
      n = this._lView[Rt];
    (n !== null && !t && pc(n, this._lView), Nh(this._lView[D], this._lView));
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new y(902, !1);
    this._appRef = t;
    let n = Kn(this._lView),
      r = this._lView[Rt];
    (r !== null && !n && Zh(r, this._lView), Ro(this._lView));
  }
};
var En = (() => {
  class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = E_;
    constructor(n, r, i) {
      ((this._declarationLView = n), (this._declarationTContainer = r), (this.elementRef = i));
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, r) {
      return this.createEmbeddedViewImpl(n, r);
    }
    createEmbeddedViewImpl(n, r, i) {
      let o = Cc(this._declarationLView, this._declarationTContainer, n, {
        embeddedViewInjector: r,
        dehydratedView: i,
      });
      return new Lt(o);
    }
  }
  return e;
})();
function E_() {
  return ms(ae(), S());
}
function ms(e, t) {
  return e.type & 4 ? new En(t, e, lr(e, t)) : null;
}
function dr(e, t, n, r, i) {
  let o = e.data[t];
  if (o === null) ((o = C_(e, t, n, r, i)), cf() && (o.flags |= 32));
  else if (o.type & 64) {
    ((o.type = n), (o.value = r), (o.attrs = i));
    let s = of();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (Xn(o, !0), o);
}
function C_(e, t, n, r, i) {
  let o = pl(),
    s = ml(),
    a = s ? o : o && o.parent,
    l = (e.data[t] = I_(e, a, n, t, r, i));
  return (w_(e, l, o, s), l);
}
function w_(e, t, n, r) {
  (e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n))));
}
function I_(e, t, n, r, i, o) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    dl() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var $x = new RegExp(`^(\\d+)*(${ny}|${ty})*(.*)`);
var M_ = () => null,
  T_ = () => null;
function Hl(e, t) {
  return M_(e, t);
}
function S_(e, t, n) {
  return T_(e, t, n);
}
var Yh = class {},
  gs = class {},
  $l = class {
    resolveComponentFactory(t) {
      throw new y(917, !1);
    }
  },
  vs = class {
    static NULL = new $l();
  },
  mt = class {},
  Vt = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => x_();
    }
    return e;
  })();
function x_() {
  let e = S(),
    t = ae(),
    n = Re(t.index, e);
  return (Je(n) ? n : e)[H];
}
var Qh = (() => {
  class e {
    static ɵprov = _({ token: e, providedIn: 'root', factory: () => null });
  }
  return e;
})();
var Wo = {},
  zl = class {
    injector;
    parentInjector;
    constructor(t, n) {
      ((this.injector = t), (this.parentInjector = n));
    }
    get(t, n, r) {
      let i = this.injector.get(t, Wo, r);
      return i !== Wo || n === Wo ? i : this.parentInjector.get(t, n, r);
    }
  };
function ts(e, t, n) {
  let r = n ? e.styles : null,
    i = n ? e.classes : null,
    o = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == 'number') o = a;
      else if (o == 1) i = Ua(i, a);
      else if (o == 2) {
        let l = a,
          c = t[++s];
        r = Ua(r, l + ': ' + c + ';');
      }
    }
  (n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = i) : (e.classesWithoutHost = i));
}
function le(e, t = 0) {
  let n = S();
  if (n === null) return I(e, t);
  let r = ae();
  return lh(r, n, ue(e), t);
}
function Kh(e, t, n, r, i) {
  let o = r === null ? null : { '': -1 },
    s = i(e, n);
  if (s !== null) {
    let a = s,
      l = null,
      c = null;
    for (let u of s)
      if (u.resolveHostDirectives !== null) {
        [a, l, c] = u.resolveHostDirectives(s);
        break;
      }
    R_(e, t, n, a, o, l, c);
  }
  o !== null && r !== null && A_(n, r, o);
}
function A_(e, t, n) {
  let r = (e.localNames = []);
  for (let i = 0; i < t.length; i += 2) {
    let o = n[t[i + 1]];
    if (o == null) throw new y(-301, !1);
    r.push(t[i], o);
  }
}
function N_(e, t, n) {
  ((t.componentOffset = n), (e.components ??= []).push(t.index));
}
function R_(e, t, n, r, i, o, s) {
  let a = r.length,
    l = !1;
  for (let p = 0; p < a; p++) {
    let f = r[p];
    (!l && et(f) && ((l = !0), N_(e, n, p)), Fl(Qo(n, t), e, f.type));
  }
  j_(n, e.data.length, a);
  for (let p = 0; p < a; p++) {
    let f = r[p];
    f.providersResolver && f.providersResolver(f);
  }
  let c = !1,
    u = !1,
    d = xh(e, t, a, null);
  a > 0 && (n.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let f = r[p];
    if (
      ((n.mergedAttrs = ir(n.mergedAttrs, f.hostAttrs)),
      F_(e, n, t, d, f),
      L_(d, f, i),
      s !== null && s.has(f))
    ) {
      let [E, b] = s.get(f);
      n.directiveToIndex.set(f.type, [d, E + n.directiveStart, b + n.directiveStart]);
    } else (o === null || !o.has(f)) && n.directiveToIndex.set(f.type, d);
    (f.contentQueries !== null && (n.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (n.flags |= 64));
    let m = f.type.prototype;
    (!c &&
      (m.ngOnChanges || m.ngOnInit || m.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (c = !0)),
      !u &&
        (m.ngOnChanges || m.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (u = !0)),
      d++);
  }
  O_(e, n, o);
}
function O_(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let i = e.data[r];
    if (n === null || !n.has(i)) (Rf(0, t, i, r), Rf(1, t, i, r), Ff(t, r, !1));
    else {
      let o = n.get(i);
      (Of(0, t, o, r), Of(1, t, o, r), Ff(t, r, !0));
    }
  }
}
function Rf(e, t, n, r) {
  let i = e === 0 ? n.inputs : n.outputs;
  for (let o in i)
    if (i.hasOwnProperty(o)) {
      let s;
      (e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[o] ??= []),
        s[o].push(r),
        Xh(t, o));
    }
}
function Of(e, t, n, r) {
  let i = e === 0 ? n.inputs : n.outputs;
  for (let o in i)
    if (i.hasOwnProperty(o)) {
      let s = i[o],
        a;
      (e === 0 ? (a = t.hostDirectiveInputs ??= {}) : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, o),
        Xh(t, s));
    }
}
function Xh(e, t) {
  t === 'class' ? (e.flags |= 8) : t === 'style' && (e.flags |= 16);
}
function Ff(e, t, n) {
  let { attrs: r, inputs: i, hostDirectiveInputs: o } = e;
  if (r === null || (!n && i === null) || (n && o === null) || cc(e)) {
    ((e.initialInputs ??= []), e.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let l = r[a];
    if (l === 0) {
      a += 4;
      continue;
    } else if (l === 5) {
      a += 2;
      continue;
    } else if (typeof l == 'number') break;
    if (!n && i.hasOwnProperty(l)) {
      let c = i[l];
      for (let u of c)
        if (u === t) {
          ((s ??= []), s.push(l, r[a + 1]));
          break;
        }
    } else if (n && o.hasOwnProperty(l)) {
      let c = o[l];
      for (let u = 0; u < c.length; u += 2)
        if (c[u] === t) {
          ((s ??= []), s.push(c[u + 1], r[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function F_(e, t, n, r, i) {
  e.data[r] = i;
  let o = i.factory || (i.factory = Hn(i.type, !0)),
    s = new Dn(o, et(i), le, null);
  ((e.blueprint[r] = s), (n[r] = s), k_(e, t, r, xh(e, n, i.hostVars, gt), i));
}
function k_(e, t, n, r, i) {
  let o = i.hostBindings;
  if (o) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    (P_(s) != a && s.push(a), s.push(n, r, o));
  }
}
function P_(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == 'number' && n < 0) return n;
  }
  return 0;
}
function L_(e, t, n) {
  if (n) {
    if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    et(t) && (n[''] = e);
  }
}
function j_(e, t, n) {
  ((e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t));
}
function Mc(e, t, n, r, i, o, s, a) {
  let l = t[D],
    c = l.consts,
    u = tt(c, s),
    d = dr(l, e, n, r, u);
  return (
    o && Kh(l, t, d, tt(c, a), i),
    (d.mergedAttrs = ir(d.mergedAttrs, d.attrs)),
    d.attrs !== null && ts(d, d.attrs, !1),
    d.mergedAttrs !== null && ts(d, d.mergedAttrs, !0),
    l.queries !== null && l.queries.elementStart(l, d),
    d
  );
}
function Tc(e, t) {
  (eh(e, t), rl(t) && e.queries.elementEnd(t));
}
function V_(e, t, n, r, i, o) {
  let s = t.consts,
    a = tt(s, i),
    l = dr(t, e, n, r, a);
  if (((l.mergedAttrs = ir(l.mergedAttrs, l.attrs)), o != null)) {
    let c = tt(s, o);
    l.localNames = [];
    for (let u = 0; u < c.length; u += 2) l.localNames.push(c[u], -1);
  }
  return (
    l.attrs !== null && ts(l, l.attrs, !1),
    l.mergedAttrs !== null && ts(l, l.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, l),
    l
  );
}
function fr(e, t, n) {
  if (n === gt) return !1;
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Ml(e, t, n) {
  return function r(i) {
    let o = Ft(e) ? Re(e.index, t) : t;
    wc(o, 5);
    let s = t[se],
      a = kf(t, s, n, i),
      l = r.__ngNextListenerFn__;
    for (; l; ) ((a = kf(t, s, l, i) && a), (l = l.__ngNextListenerFn__));
    return a;
  };
}
function kf(e, t, n, r) {
  let i = w(null);
  try {
    return (O(6, t, n), n(r) !== !1);
  } catch (o) {
    return (n_(e, o), !1);
  } finally {
    (O(7, t, n), w(i));
  }
}
function B_(e, t, n, r, i, o, s, a) {
  let l = Qn(e),
    c = !1,
    u = null;
  if ((!r && l && (u = H_(t, n, o, e.index)), u !== null)) {
    let d = u.__ngLastListenerFn__ || u;
    ((d.__ngNextListenerFn__ = s), (u.__ngLastListenerFn__ = s), (c = !0));
  } else {
    let d = Ve(e, n),
      p = r ? r(d) : d;
    iy(n, p, o, a);
    let f = i.listen(p, o, a);
    if (!U_(o)) {
      let m = r ? (E) => r(Ne(E[e.index])) : e.index;
      Jh(m, t, n, o, a, f, !1);
    }
  }
  return c;
}
function U_(e) {
  return e.startsWith('animation') || e.startsWith('transition');
}
function H_(e, t, n, r) {
  let i = e.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === n && i[o + 1] === r) {
        let a = t[qn],
          l = i[o + 2];
        return a && a.length > l ? a[l] : null;
      }
      typeof s == 'string' && (o += 2);
    }
  return null;
}
function Jh(e, t, n, r, i, o, s) {
  let a = t.firstCreatePass ? cl(t) : null,
    l = ll(n),
    c = l.length;
  (l.push(i, o), a && a.push(r, e, c, (c + 1) * (s ? -1 : 1)));
}
function Pf(e, t, n, r, i, o) {
  let s = t[n],
    a = t[D],
    c = a.data[n].outputs[r],
    d = s[c].subscribe(o);
  Jh(e.index, a, t, i, o, d, !0);
}
var Gl = Symbol('BINDING');
var Wl = class extends vs {
  ngModule;
  constructor(t) {
    (super(), (this.ngModule = t));
  }
  resolveComponentFactory(t) {
    let n = Nt(t);
    return new sr(n, this.ngModule);
  }
};
function $_(e) {
  return Object.keys(e).map((t) => {
    let [n, r, i] = e[t],
      o = { propName: n, templateName: t, isSignal: (r & ds.SignalBased) !== 0 };
    return (i && (o.transform = i), o);
  });
}
function z_(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function G_(e, t, n) {
  let r = t instanceof ee ? t : t?.injector;
  return (
    r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r),
    r ? new zl(n, r) : n
  );
}
function W_(e) {
  let t = e.get(mt, null);
  if (t === null) throw new y(407, !1);
  let n = e.get(Qh, null),
    r = e.get(xe, null);
  return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r, ngReflect: !1 };
}
function q_(e, t) {
  let n = ep(e);
  return Ih(t, n, n === 'svg' ? Zd : n === 'math' ? Yd : null);
}
function ep(e) {
  return (e.selectors[0][0] || 'div').toLowerCase();
}
var sr = class extends gs {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return ((this.cachedInputs ??= $_(this.componentDef.inputs)), this.cachedInputs);
  }
  get outputs() {
    return ((this.cachedOutputs ??= z_(this.componentDef.outputs)), this.cachedOutputs);
  }
  constructor(t, n) {
    (super(),
      (this.componentDef = t),
      (this.ngModule = n),
      (this.componentType = t.type),
      (this.selector = by(t.selectors)),
      (this.ngContentSelectors = t.ngContentSelectors ?? []),
      (this.isBoundToModule = !!n));
  }
  create(t, n, r, i, o, s) {
    O(22);
    let a = w(null);
    try {
      let l = this.componentDef,
        c = Z_(r, l, s, o),
        u = G_(l, i || this.ngModule, t),
        d = W_(u),
        p = d.rendererFactory.createRenderer(null, l),
        f = r ? zy(p, r, l.encapsulation, u) : q_(l, p),
        m = s?.some(Lf) || o?.some((g) => typeof g != 'function' && g.bindings.some(Lf)),
        E = dc(null, c, null, 512 | Sh(l), null, null, d, p, u, null, bh(f, u, !0));
      ((E[q] = f), Po(E));
      let b = null;
      try {
        let g = Mc(q, E, 2, '#host', () => c.directiveRegistry, !0, 0);
        (Th(p, f, g),
          or(f, E),
          ps(c, E, g),
          lc(c, g, E),
          Tc(c, g),
          n !== void 0 && Q_(g, this.ngContentSelectors, n),
          (b = Re(g.index, E)),
          (E[se] = b[se]),
          Ec(c, E, null));
      } catch (g) {
        throw (b !== null && kl(b), kl(E), g);
      } finally {
        (O(23), Lo());
      }
      return new ns(this.componentType, E, !!m);
    } finally {
      w(a);
    }
  }
};
function Z_(e, t, n, r) {
  let i = e ? ['ng-version', '20.3.3'] : Dy(t.selectors[0]),
    o = null,
    s = null,
    a = 0;
  if (n)
    for (let u of n)
      ((a += u[Gl].requiredVars),
        u.create && ((u.targetIdx = 0), (o ??= []).push(u)),
        u.update && ((u.targetIdx = 0), (s ??= []).push(u)));
  if (r)
    for (let u = 0; u < r.length; u++) {
      let d = r[u];
      if (typeof d != 'function')
        for (let p of d.bindings) {
          a += p[Gl].requiredVars;
          let f = u + 1;
          (p.create && ((p.targetIdx = f), (o ??= []).push(p)),
            p.update && ((p.targetIdx = f), (s ??= []).push(p)));
        }
    }
  let l = [t];
  if (r)
    for (let u of r) {
      let d = typeof u == 'function' ? u : u.type,
        p = Ka(d);
      l.push(p);
    }
  return uc(0, null, Y_(o, s), 1, a, l, null, null, null, [i], null);
}
function Y_(e, t) {
  return !e && !t
    ? null
    : (n) => {
        if (n & 1 && e) for (let r of e) r.create();
        if (n & 2 && t) for (let r of t) r.update();
      };
}
function Lf(e) {
  let t = e[Gl].kind;
  return t === 'input' || t === 'twoWay';
}
var ns = class extends Yh {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(t, n, r) {
    (super(),
      (this._rootLView = n),
      (this._hasInputBindings = r),
      (this._tNode = $r(n[D], q)),
      (this.location = lr(this._tNode, n)),
      (this.instance = Re(this._tNode.index, n)[se]),
      (this.hostView = this.changeDetectorRef = new Lt(n, void 0)),
      (this.componentType = t));
  }
  setInput(t, n) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
    )
      return;
    let i = this._rootLView,
      o = Dc(r, i[D], i, t, n);
    this.previousInputValues.set(t, n);
    let s = Re(r.index, i);
    wc(s, 1);
  }
  get injector() {
    return new bn(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(t) {
    this.hostView.onDestroy(t);
  }
};
function Q_(e, t, n) {
  let r = (e.projection = []);
  for (let i = 0; i < t.length; i++) {
    let o = n[i];
    r.push(o != null && o.length ? Array.from(o) : null);
  }
}
var vt = (() => {
  class e {
    static __NG_ELEMENT_ID__ = K_;
  }
  return e;
})();
function K_() {
  let e = ae();
  return np(e, S());
}
var X_ = vt,
  tp = class extends X_ {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, r) {
      (super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r));
    }
    get element() {
      return lr(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new bn(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = ic(this._hostTNode, this._hostLView);
      if (nh(t)) {
        let n = Yo(t, this._hostLView),
          r = Zo(t),
          i = n[D].data[r + 8];
        return new bn(i, n);
      } else return new bn(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = jf(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - de;
    }
    createEmbeddedView(t, n, r) {
      let i, o;
      typeof r == 'number' ? (i = r) : r != null && ((i = r.index), (o = r.injector));
      let s = Hl(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, o, s);
      return (this.insertImpl(a, i, Jo(this._hostTNode, s)), a);
    }
    createComponent(t, n, r, i, o, s, a) {
      let l = t && !Av(t),
        c;
      if (l) c = n;
      else {
        let b = n || {};
        ((c = b.index),
          (r = b.injector),
          (i = b.projectableNodes),
          (o = b.environmentInjector || b.ngModuleRef),
          (s = b.directives),
          (a = b.bindings));
      }
      let u = l ? t : new sr(Nt(t)),
        d = r || this.parentInjector;
      if (!o && u.ngModule == null) {
        let g = (l ? d : this.parentInjector).get(ee, null);
        g && (o = g);
      }
      let p = Nt(u.componentType ?? {}),
        f = Hl(this._lContainer, p?.id ?? null),
        m = f?.firstChild ?? null,
        E = u.create(d, i, m, o, s, a);
      return (this.insertImpl(E.hostView, c, Jo(this._hostTNode, f)), E);
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let i = t._lView;
      if (Xd(i)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let l = i[ie],
            c = new tp(l, l[pe], l[ie]);
          c.detach(c.indexOf(t));
        }
      }
      let o = this._adjustIndex(n),
        s = this._lContainer;
      return (Ic(s, i, o, r), t.attachToViewContainerRef(), Za(Tl(s), o, t), t);
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = jf(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = es(this._lContainer, n);
      r && (Vr(Tl(this._lContainer), n), mc(r[D], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = es(this._lContainer, n);
      return r && Vr(Tl(this._lContainer), n) != null ? new Lt(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function jf(e) {
  return e[Hr];
}
function Tl(e) {
  return e[Hr] || (e[Hr] = []);
}
function np(e, t) {
  let n,
    r = t[e.index];
  return (
    je(r) ? (n = r) : ((n = qh(r, t, null, e)), (t[e.index] = n), fc(t, n)),
    eb(n, t, e, r),
    new tp(n, e, t)
  );
}
function J_(e, t) {
  let n = e[H],
    r = n.createComment(''),
    i = Ve(t, e),
    o = n.parentNode(i);
  return (Xo(n, o, r, n.nextSibling(i), !1), r);
}
var eb = rb,
  tb = () => !1;
function nb(e, t, n) {
  return tb(e, t, n);
}
function rb(e, t, n, r) {
  if (e[Ot]) return;
  let i;
  (n.type & 8 ? (i = Ne(r)) : (i = J_(t, n)), (e[Ot] = i));
}
var ql = class e {
    queryList;
    matches = null;
    constructor(t) {
      this.queryList = t;
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  Zl = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let n = t.queries;
      if (n !== null) {
        let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
          i = [];
        for (let o = 0; o < r; o++) {
          let s = n.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new e(i);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let n = 0; n < this.queries.length; n++)
        xc(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  rs = class {
    flags;
    read;
    predicate;
    constructor(t, n, r = null) {
      ((this.flags = n),
        (this.read = r),
        typeof t == 'string' ? (this.predicate = lb(t)) : (this.predicate = t));
    }
  },
  Yl = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, n) {
      for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(t, n);
    }
    elementEnd(t) {
      for (let n = 0; n < this.queries.length; n++) this.queries[n].elementEnd(t);
    }
    embeddedTView(t) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let i = n !== null ? n.length : 0,
          o = this.getByIndex(r).embeddedTView(t, i);
        o && ((o.indexInDeclarationView = r), n !== null ? n.push(o) : (n = [o]));
      }
      return n !== null ? new e(n) : null;
    }
    template(t, n) {
      for (let r = 0; r < this.queries.length; r++) this.queries[r].template(t, n);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  Ql = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) {
      ((this.metadata = t), (this._declarationNodeIndex = n));
    }
    elementStart(t, n) {
      this.isApplyingToNode(n) && this.matchTNode(t, n);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
    }
    template(t, n) {
      this.elementStart(t, n);
    }
    embeddedTView(t, n) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = !0), this.addMatch(-t.index, n), new e(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = t.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let i = 0; i < r.length; i++) {
          let o = r[i];
          (this.matchTNodeWithReadOption(t, n, ib(n, o)),
            this.matchTNodeWithReadOption(t, n, Go(n, t, o, !1, !1)));
        }
      else
        r === En
          ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
          : this.matchTNodeWithReadOption(t, n, Go(n, t, r, !1, !1));
    }
    matchTNodeWithReadOption(t, n, r) {
      if (r !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === Q || i === vt || (i === En && n.type & 4)) this.addMatch(n.index, -2);
          else {
            let o = Go(n, t, i, !1, !1);
            o !== null && this.addMatch(n.index, o);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(t, n) {
      this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
    }
  };
function ib(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function ob(e, t) {
  return e.type & 11 ? lr(e, t) : e.type & 4 ? ms(e, t) : null;
}
function sb(e, t, n, r) {
  return n === -1 ? ob(t, e) : n === -2 ? ab(e, t, r) : Kr(e, e[D], n, t);
}
function ab(e, t, n) {
  if (n === Q) return lr(t, e);
  if (n === En) return ms(t, e);
  if (n === vt) return np(t, e);
}
function rp(e, t, n, r) {
  let i = t[Xe].queries[r];
  if (i.matches === null) {
    let o = e.data,
      s = n.matches,
      a = [];
    for (let l = 0; s !== null && l < s.length; l += 2) {
      let c = s[l];
      if (c < 0) a.push(null);
      else {
        let u = o[c];
        a.push(sb(t, u, s[l + 1], n.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function Kl(e, t, n, r) {
  let i = e.queries.getByIndex(n),
    o = i.matches;
  if (o !== null) {
    let s = rp(e, t, i, n);
    for (let a = 0; a < o.length; a += 2) {
      let l = o[a];
      if (l > 0) r.push(s[a / 2]);
      else {
        let c = o[a + 1],
          u = t[-l];
        for (let d = de; d < u.length; d++) {
          let p = u[d];
          p[Rt] === p[ie] && Kl(p[D], p, c, r);
        }
        if (u[pn] !== null) {
          let d = u[pn];
          for (let p = 0; p < d.length; p++) {
            let f = d[p];
            Kl(f[D], f, c, r);
          }
        }
      }
    }
  }
  return r;
}
function Sc(e, t) {
  return e[Xe].queries[t].queryList;
}
function ip(e, t, n) {
  let r = new Ko((n & 4) === 4);
  return (tf(e, t, r, r.destroy), (t[Xe] ??= new Zl()).queries.push(new ql(r)) - 1);
}
function op(e, t, n) {
  let r = te();
  return (
    r.firstCreatePass && (ap(r, new rs(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    ip(r, S(), t)
  );
}
function sp(e, t, n, r) {
  let i = te();
  if (i.firstCreatePass) {
    let o = ae();
    (ap(i, new rs(t, n, r), o.index), cb(i, e), (n & 2) === 2 && (i.staticContentQueries = !0));
  }
  return ip(i, S(), n);
}
function lb(e) {
  return e.split(',').map((t) => t.trim());
}
function ap(e, t, n) {
  (e.queries === null && (e.queries = new Yl()), e.queries.track(new Ql(t, n)));
}
function cb(e, t) {
  let n = e.contentQueries || (e.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  t !== r && n.push(e.queries.length - 1, t);
}
function xc(e, t) {
  return e.queries.getByIndex(t);
}
function lp(e, t) {
  let n = e[D],
    r = xc(n, t);
  return r.crossesNgTemplate ? Kl(n, e, t, []) : rp(n, e, r, t);
}
function cp(e, t, n) {
  let r,
    i = Nr(() => {
      r._dirtyCounter();
      let o = ub(r, e);
      if (t && o === void 0) throw new y(-951, !1);
      return o;
    });
  return ((r = i[J]), (r._dirtyCounter = ne(0)), (r._flatValue = void 0), i);
}
function Ac(e) {
  return cp(!0, !1, e);
}
function Nc(e) {
  return cp(!0, !0, e);
}
function up(e, t) {
  let n = e[J];
  ((n._lView = S()),
    (n._queryIndex = t),
    (n._queryList = Sc(n._lView, t)),
    n._queryList.onDirty(() => n._dirtyCounter.update((r) => r + 1)));
}
function ub(e, t) {
  let n = e._lView,
    r = e._queryIndex;
  if (n === void 0 || r === void 0 || n[C] & 4) return t ? void 0 : be;
  let i = Sc(n, r),
    o = lp(n, r);
  return (
    i.reset(o, dh),
    t
      ? i.first
      : i._changesDetected || e._flatValue === void 0
        ? (e._flatValue = i.toArray())
        : e._flatValue
  );
}
var Vf = new Set();
function ri(e) {
  Vf.has(e) || (Vf.add(e), performance?.mark?.('mark_feature_usage', { detail: { feature: e } }));
}
var Jr = class {};
var ei = class extends Jr {
  injector;
  componentFactoryResolver = new Wl(this);
  instance = null;
  constructor(t) {
    super();
    let n = new sn(
      [
        ...t.providers,
        { provide: Jr, useValue: this },
        { provide: vs, useValue: this.componentFactoryResolver },
      ],
      t.parent || Gn(),
      t.debugName,
      new Set(['environment']),
    );
    ((this.injector = n), t.runEnvironmentInitializers && n.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function Rc(e, t, n = null) {
  return new ei({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector;
}
var db = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Xa(!1, n.type),
          i = r.length > 0 ? Rc([r], this._injector, `Standalone[${n.type.name}]`) : null;
        this.cachedInjectors.set(n, i);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = _({ token: e, providedIn: 'environment', factory: () => new e(I(ee)) });
  }
  return e;
})();
function yt(e) {
  return ls(() => {
    let t = dp(e),
      n = R(M({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === oc.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (i) => i.get(db).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || pt.Emulated,
        styles: e.styles || be,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      });
    (t.standalone && ri('NgStandalone'), fp(n));
    let r = e.dependencies;
    return ((n.directiveDefs = Bf(r, fb)), (n.pipeDefs = Bf(r, Ud)), (n.id = mb(n)), n);
  });
}
function fb(e) {
  return Nt(e) || Ka(e);
}
function re(e) {
  return ls(() => ({
    type: e.type,
    bootstrap: e.bootstrap || be,
    declarations: e.declarations || be,
    imports: e.imports || be,
    exports: e.exports || be,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function hb(e, t) {
  if (e == null) return At;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let i = e[r],
        o,
        s,
        a,
        l;
      (Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o), (l = i[3] || null))
        : ((o = i), (s = i), (a = ds.None), (l = null)),
        (n[o] = [r, a, l]),
        (t[o] = s));
    }
  return n;
}
function pb(e) {
  if (e == null) return At;
  let t = {};
  for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
  return t;
}
function $(e) {
  return ls(() => {
    let t = dp(e);
    return (fp(t), t);
  });
}
function dp(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputConfig: e.inputs || At,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || be,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: hb(e.inputs, t),
    outputs: pb(e.outputs),
    debugInfo: null,
  };
}
function fp(e) {
  e.features?.forEach((t) => t(e));
}
function Bf(e, t) {
  return e
    ? () => {
        let n = typeof e == 'function' ? e() : e,
          r = [];
        for (let i of n) {
          let o = t(i);
          o !== null && r.push(o);
        }
        return r;
      }
    : null;
}
function mb(e) {
  let t = 0,
    n = typeof e.consts == 'function' ? '' : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let o of r.join('|')) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return ((t += 2147483648), 'c' + t);
}
function gb(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function ii(e) {
  let t = gb(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let i;
    if (et(e)) i = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new y(903, !1);
      i = t.ɵdir;
    }
    if (i) {
      if (n) {
        r.push(i);
        let s = e;
        ((s.inputs = Sl(e.inputs)),
          (s.declaredInputs = Sl(e.declaredInputs)),
          (s.outputs = Sl(e.outputs)));
        let a = i.hostBindings;
        a && Db(e, a);
        let l = i.viewQuery,
          c = i.contentQueries;
        if (
          (l && _b(e, l),
          c && bb(e, c),
          vb(e, i),
          Ad(e.outputs, i.outputs),
          et(i) && i.data.animation)
        ) {
          let u = e.data;
          u.animation = (u.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          (a && a.ngInherit && a(e), a === ii && (n = !1));
        }
    }
    t = Object.getPrototypeOf(t);
  }
  yb(r);
}
function vb(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    r !== void 0 && ((e.inputs[n] = r), (e.declaredInputs[n] = t.declaredInputs[n]));
  }
}
function yb(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let i = e[r];
    ((i.hostVars = t += i.hostVars), (i.hostAttrs = ir(i.hostAttrs, (n = ir(n, i.hostAttrs)))));
  }
}
function Sl(e) {
  return e === At ? {} : e === be ? [] : e;
}
function _b(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, i) => {
        (t(r, i), n(r, i));
      })
    : (e.viewQuery = t);
}
function bb(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, i, o) => {
        (t(r, i, o), n(r, i, o));
      })
    : (e.contentQueries = t);
}
function Db(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, i) => {
        (t(r, i), n(r, i));
      })
    : (e.hostBindings = t);
}
function hp(e, t, n, r, i, o, s, a) {
  if (n.firstCreatePass) {
    e.mergedAttrs = ir(e.mergedAttrs, e.attrs);
    let u = (e.tView = uc(
      2,
      e,
      i,
      o,
      s,
      n.directiveRegistry,
      n.pipeRegistry,
      null,
      n.schemas,
      n.consts,
      null,
    ));
    n.queries !== null && (n.queries.template(n, e), (u.queries = n.queries.embeddedTView(e)));
  }
  (a && (e.flags |= a), Xn(e, !1));
  let l = Cb(n, t, e, r);
  (Vo() && gc(n, t, l, e), or(l, t));
  let c = qh(l, t, l, e);
  ((t[r + q] = c), fc(t, c), nb(c, e, t));
}
function Eb(e, t, n, r, i, o, s, a, l, c, u) {
  let d = n + q,
    p;
  return (
    t.firstCreatePass
      ? ((p = dr(t, d, 4, s || null, a || null)),
        Oo() && Kh(t, e, p, tt(t.consts, c), yc),
        eh(t, p))
      : (p = t.data[d]),
    hp(p, e, t, n, r, i, o, l),
    Qn(p) && ps(t, e, p),
    c != null && ni(e, p, u),
    p
  );
}
function Oc(e, t, n, r, i, o, s, a, l, c, u) {
  let d = n + q,
    p;
  if (t.firstCreatePass) {
    if (((p = dr(t, d, 4, s || null, a || null)), c != null)) {
      let f = tt(t.consts, c);
      p.localNames = [];
      for (let m = 0; m < f.length; m += 2) p.localNames.push(f[m], -1);
    }
  } else p = t.data[d];
  return (hp(p, e, t, n, r, i, o, l), c != null && ni(e, p, u), p);
}
function Bt(e, t, n, r, i, o, s, a) {
  let l = S(),
    c = te(),
    u = tt(c.consts, o);
  return (Eb(l, c, e, t, n, r, i, u, void 0, s, a), Bt);
}
var Cb = wb;
function wb(e, t, n, r) {
  return (Wr(!0), t[H].createComment(''));
}
var ys = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = 'CHANGE_DETECTION'),
      (e[(e.AFTER_NEXT_RENDER = 1)] = 'AFTER_NEXT_RENDER'),
      e
    );
  })(ys || {}),
  wn = new v(''),
  pp = !1,
  Xl = class extends j {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      (super(),
        (this.__isAsync = t),
        Wd() &&
          ((this.destroyRef = h(Be, { optional: !0 }) ?? void 0),
          (this.pendingTasks = h(ht, { optional: !0 }) ?? void 0)));
    }
    emit(t) {
      let n = w(null);
      try {
        super.next(t);
      } finally {
        w(n);
      }
    }
    subscribe(t, n, r) {
      let i = t,
        o = n || (() => null),
        s = r;
      if (t && typeof t == 'object') {
        let l = t;
        ((i = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l)));
      }
      this.__isAsync &&
        ((o = this.wrapInTimeout(o)),
        i && (i = this.wrapInTimeout(i)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: i, error: o, complete: s });
      return (t instanceof Z && t.add(a), a);
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            t(n);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  z = Xl;
function mp(e) {
  let t, n;
  function r() {
    e = _n;
    try {
      (n !== void 0 && typeof cancelAnimationFrame == 'function' && cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t));
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      (e(), r());
    })),
    typeof requestAnimationFrame == 'function' &&
      (n = requestAnimationFrame(() => {
        (e(), r());
      })),
    () => r()
  );
}
function Uf(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = _n;
    }
  );
}
var Fc = 'isAngularZone',
  is = Fc + '_ID',
  Ib = 0,
  A = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new z(!1);
    onMicrotaskEmpty = new z(!1);
    onStable = new z(!1);
    onError = new z(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: i = !1,
        scheduleInRootZone: o = pp,
      } = t;
      if (typeof Zone > 'u') throw new y(908, !1);
      Zone.assertZonePatched();
      let s = this;
      ((s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !i && r),
        (s.shouldCoalesceRunChangeDetection = i),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = o),
        Sb(s));
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(Fc) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new y(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new y(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, i) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + i, t, Mb, _n, _n);
      try {
        return o.runTask(s, n, r);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Mb = {};
function kc(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      (e._nesting++, e.onMicrotaskEmpty.emit(null));
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function Tb(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    mp(() => {
      ((e.callbackScheduled = !1),
        Jl(e),
        (e.isCheckStableRunning = !0),
        kc(e),
        (e.isCheckStableRunning = !1));
    });
  }
  (e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Jl(e));
}
function Sb(e) {
  let t = () => {
      Tb(e);
    },
    n = Ib++;
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { [Fc]: !0, [is]: n, [is + n]: !0 },
    onInvokeTask: (r, i, o, s, a, l) => {
      if (xb(l)) return r.invokeTask(o, s, a, l);
      try {
        return (Hf(e), r.invokeTask(o, s, a, l));
      } finally {
        (((e.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          $f(e));
      }
    },
    onInvoke: (r, i, o, s, a, l, c) => {
      try {
        return (Hf(e), r.invoke(o, s, a, l, c));
      } finally {
        (e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !Ab(l) && t(), $f(e));
      }
    },
    onHasTask: (r, i, o, s) => {
      (r.hasTask(o, s),
        i === o &&
          (s.change == 'microTask'
            ? ((e._hasPendingMicrotasks = s.microTask), Jl(e), kc(e))
            : s.change == 'macroTask' && (e.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (r, i, o, s) => (
      r.handleError(o, s),
      e.runOutsideAngular(() => e.onError.emit(s)),
      !1
    ),
  });
}
function Jl(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Hf(e) {
  (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function $f(e) {
  (e._nesting--, kc(e));
}
var os = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new z();
  onMicrotaskEmpty = new z();
  onStable = new z();
  onError = new z();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, i) {
    return t.apply(n, r);
  }
};
function xb(e) {
  return gp(e, '__ignore_ng_zone__');
}
function Ab(e) {
  return gp(e, '__scheduler_tick__');
}
function gp(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var Pc = (() => {
    class e {
      impl = null;
      execute() {
        this.impl?.execute();
      }
      static ɵprov = _({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  Lc = [0, 1, 2, 3],
  vp = (() => {
    class e {
      ngZone = h(A);
      scheduler = h(xe);
      errorHandler = h(Se, { optional: !0 });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = !1;
      constructor() {
        h(wn, { optional: !0 });
      }
      execute() {
        let n = this.sequences.size > 0;
        (n && O(16), (this.executing = !0));
        for (let r of Lc)
          for (let i of this.sequences)
            if (!(i.erroredOrDestroyed || !i.hooks[r]))
              try {
                i.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                  this.maybeTrace(() => {
                    let o = i.hooks[r];
                    return o(i.pipelinedValue);
                  }, i.snapshot),
                );
              } catch (o) {
                ((i.erroredOrDestroyed = !0), this.errorHandler?.handleError(o));
              }
        this.executing = !1;
        for (let r of this.sequences)
          (r.afterRun(), r.once && (this.sequences.delete(r), r.destroy()));
        for (let r of this.deferredRegistrations) this.sequences.add(r);
        (this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
          this.deferredRegistrations.clear(),
          n && O(17));
      }
      register(n) {
        let { view: r } = n;
        r !== void 0
          ? ((r[hn] ??= []).push(n), kt(r), (r[C] |= 8192))
          : this.executing
            ? this.deferredRegistrations.add(n)
            : this.addSequence(n);
      }
      addSequence(n) {
        (this.sequences.add(n), this.scheduler.notify(7));
      }
      unregister(n) {
        this.executing && this.sequences.has(n)
          ? ((n.erroredOrDestroyed = !0), (n.pipelinedValue = void 0), (n.once = !0))
          : (this.sequences.delete(n), this.deferredRegistrations.delete(n));
      }
      maybeTrace(n, r) {
        return r ? r.run(ys.AFTER_NEXT_RENDER, n) : n();
      }
      static ɵprov = _({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  ss = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, r, i, o, s = null) {
      ((this.impl = t),
        (this.hooks = n),
        (this.view = r),
        (this.once = i),
        (this.snapshot = s),
        (this.unregisterOnDestroy = o?.onDestroy(() => this.destroy())));
    }
    afterRun() {
      ((this.erroredOrDestroyed = !1),
        (this.pipelinedValue = void 0),
        this.snapshot?.dispose(),
        (this.snapshot = null));
    }
    destroy() {
      (this.impl.unregister(this), this.unregisterOnDestroy?.());
      let t = this.view?.[hn];
      t && (this.view[hn] = t.filter((n) => n !== this));
    }
  };
var jc = new v('');
function In(e) {
  return !!e && typeof e.then == 'function';
}
function Vc(e) {
  return !!e && typeof e.subscribe == 'function';
}
var yp = new v('');
var Bc = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        ((this.resolve = n), (this.reject = r));
      });
      appInits = h(yp, { optional: !0 }) ?? [];
      injector = h(De);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let i of this.appInits) {
          let o = un(this.injector, i);
          if (In(o)) n.push(o);
          else if (Vc(o)) {
            let s = new Promise((a, l) => {
              o.subscribe({ complete: a, error: l });
            });
            n.push(s);
          }
        }
        let r = () => {
          ((this.done = !0), this.resolve());
        };
        (Promise.all(n)
          .then(() => {
            r();
          })
          .catch((i) => {
            this.reject(i);
          }),
          n.length === 0 && r(),
          (this.initialized = !0));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  _p = new v('');
function bp() {
  fa(() => {
    let e = '';
    throw new y(600, e);
  });
}
function Dp(e) {
  return e.isBoundToModule;
}
var Nb = 10;
var Ut = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = h(Ue);
    afterRenderManager = h(Pc);
    zonelessEnabled = h(Uo);
    rootEffectScheduler = h(Zr);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new j();
    get allViews() {
      return [
        ...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = h(ht);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(U((n) => !n));
    }
    constructor() {
      h(wn, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (i) => {
            i && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = h(ee);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, i = De.NULL) {
      return this._injector.get(A).run(() => {
        O(10);
        let s = n instanceof gs;
        if (!this._injector.get(Bc).done) {
          let m = '';
          throw new y(405, m);
        }
        let l;
        (s ? (l = n) : (l = this._injector.get(vs).resolveComponentFactory(n)),
          this.componentTypes.push(l.componentType));
        let c = Dp(l) ? void 0 : this._injector.get(Jr),
          u = r || l.selector,
          d = l.create(i, [], u, c),
          p = d.location.nativeElement,
          f = d.injector.get(jc, null);
        return (
          f?.registerApplication(p),
          d.onDestroy(() => {
            (this.detachView(d.hostView), Qr(this.components, d), f?.unregisterApplication(p));
          }),
          this._loadComponent(d),
          O(11, d),
          d
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (O(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(ys.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw new y(101, !1);
      let n = w(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          w(n),
          this.afterTick.next(),
          O(13));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(mt, null, { optional: !0 }));
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < Nb; ) (O(14), this.synchronizeOnce(), O(15));
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 && ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let n = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: i } of this.allViews) {
          if (!r && !zr(i)) continue;
          let o = r && !this.zonelessEnabled ? 0 : 1;
          ($h(i, o), (n = !0));
        }
        if (((this.dirtyFlags &= -5), this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)) return;
      }
      (n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 && ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => zr(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      (this._views.push(r), r.attachToAppRef(this));
    }
    detachView(n) {
      let r = n;
      (Qr(this._views, r), r.detachFromAppRef());
    }
    _loadComponent(n) {
      this.attachView(n.hostView);
      try {
        this.tick();
      } catch (i) {
        this.internalErrorHandler(i);
      }
      (this.components.push(n), this._injector.get(_p, []).forEach((i) => i(n)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy()));
        } finally {
          ((this._destroyed = !0), (this._views = []), (this._destroyListeners = []));
        }
    }
    onDestroy(n) {
      return (this._destroyListeners.push(n), () => Qr(this._destroyListeners, n));
    }
    destroy() {
      if (this._destroyed) throw new y(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function Qr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function _t(e, t, n, r) {
  let i = S(),
    o = er();
  if (fr(i, o, t)) {
    let s = te(),
      a = jo();
    Jy(a, i, e, t, n, r);
  }
  return _t;
}
var Yx = typeof document < 'u' && typeof document?.documentElement?.getAnimations == 'function';
function ge(e, t, n, r, i, o, s, a) {
  ri('NgControlFlow');
  let l = S(),
    c = te(),
    u = tt(c.consts, o);
  return (Oc(l, c, e, t, n, r, i, u, 256, s, a), Uc);
}
function Uc(e, t, n, r, i, o, s, a) {
  ri('NgControlFlow');
  let l = S(),
    c = te(),
    u = tt(c.consts, o);
  return (Oc(l, c, e, t, n, r, i, u, 512, s, a), Uc);
}
function ve(e, t) {
  ri('NgControlFlow');
  let n = S(),
    r = er(),
    i = n[r] !== gt ? n[r] : -1,
    o = i !== -1 ? zf(n, q + i) : void 0,
    s = 0;
  if (fr(n, r, e)) {
    let a = w(null);
    try {
      if ((o !== void 0 && b_(o, s), e !== -1)) {
        let l = q + e,
          c = zf(n, l),
          u = Rb(n[D], l),
          d = S_(c, u, n),
          p = Cc(n, u, t, { dehydratedView: d });
        Ic(c, p, s, Jo(u, d));
      }
    } finally {
      w(a);
    }
  } else if (o !== void 0) {
    let a = __(o, s);
    a !== void 0 && (a[se] = t);
  }
}
function zf(e, t) {
  return e[t];
}
function Rb(e, t) {
  return $r(e, t);
}
function Ce(e, t, n) {
  let r = S(),
    i = er();
  if (fr(r, i, t)) {
    let o = te(),
      s = jo();
    Zy(s, r, e, t, r[H], n);
  }
  return Ce;
}
function Gf(e, t, n, r, i) {
  Dc(t, e, n, i ? 'class' : 'style', r);
}
function k(e, t, n, r) {
  let i = S(),
    o = i[D],
    s = e + q,
    a = o.firstCreatePass ? Mc(s, i, 2, t, yc, Oo(), n, r) : o.data[s];
  if ((_c(a, i, e, t, Ep), Qn(a))) {
    let l = i[D];
    (ps(l, i, a), lc(l, a, i));
  }
  return (r != null && ni(i, a), k);
}
function P() {
  let e = te(),
    t = ae(),
    n = bc(t);
  return (
    e.firstCreatePass && Tc(e, n),
    fl(n) && hl(),
    ul(),
    n.classesWithoutHost != null && Pv(n) && Gf(e, n, S(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null && Lv(n) && Gf(e, n, S(), n.stylesWithoutHost, !1),
    P
  );
}
function $e(e, t, n, r) {
  return (k(e, t, n, r), P(), $e);
}
function oi(e, t, n, r) {
  let i = S(),
    o = i[D],
    s = e + q,
    a = o.firstCreatePass ? V_(s, o, 2, t, n, r) : o.data[s];
  return (_c(a, i, e, t, Ep), r != null && ni(i, a), oi);
}
function si() {
  let e = ae(),
    t = bc(e);
  return (fl(t) && hl(), ul(), si);
}
function ai(e, t, n, r) {
  return (oi(e, t, n, r), si(), ai);
}
var Ep = (e, t, n, r, i) => (Wr(!0), Ih(t[H], r, vf()));
function _s(e, t, n) {
  let r = S(),
    i = r[D],
    o = e + q,
    s = i.firstCreatePass ? Mc(o, r, 8, 'ng-container', yc, Oo(), t, n) : i.data[o];
  if ((_c(s, r, e, 'ng-container', Ob), Qn(s))) {
    let a = r[D];
    (ps(a, r, s), lc(a, s, r));
  }
  return (n != null && ni(r, s), _s);
}
function bs() {
  let e = te(),
    t = ae(),
    n = bc(t);
  return (e.firstCreatePass && Tc(e, n), bs);
}
var Ob = (e, t, n, r, i) => (Wr(!0), wy(t[H], ''));
function li() {
  return S();
}
function hr(e, t, n) {
  let r = S(),
    i = er();
  if (fr(r, i, t)) {
    let o = te(),
      s = jo();
    Lh(s, r, e, t, r[H], n);
  }
  return hr;
}
var ci = 'en-US';
var Fb = ci;
function Cp(e) {
  typeof e == 'string' && (Fb = e.toLowerCase().replace(/_/g, '-'));
}
function Te(e, t, n) {
  let r = S(),
    i = te(),
    o = ae();
  return (kb(i, r, r[H], o, e, t, n), Te);
}
function kb(e, t, n, r, i, o, s) {
  let a = !0,
    l = null;
  if (((r.type & 3 || s) && ((l ??= Ml(r, t, o)), B_(r, e, t, s, n, i, o, l) && (a = !1)), a)) {
    let c = r.outputs?.[i],
      u = r.hostDirectiveOutputs?.[i];
    if (u && u.length)
      for (let d = 0; d < u.length; d += 2) {
        let p = u[d],
          f = u[d + 1];
        ((l ??= Ml(r, t, o)), Pf(r, t, p, f, i, l));
      }
    if (c && c.length) for (let d of c) ((l ??= Ml(r, t, o)), Pf(r, t, d, i, i, l));
  }
}
function ze(e = 1) {
  return gf(e);
}
function Pb(e, t) {
  let n = null,
    r = my(e);
  for (let i = 0; i < t.length; i++) {
    let o = t[i];
    if (o === '*') {
      n = i;
      continue;
    }
    if (r === null ? wh(e, o, !0) : yy(r, o)) return i;
  }
  return n;
}
function Ds(e) {
  let t = S()[Ee][pe];
  if (!t.projection) {
    let n = e ? e.length : 1,
      r = (t.projection = jd(n, null)),
      i = r.slice(),
      o = t.child;
    for (; o !== null; ) {
      if (o.type !== 128) {
        let s = e ? Pb(o, e) : 0;
        s !== null && (i[s] ? (i[s].projectionNext = o) : (r[s] = o), (i[s] = o));
      }
      o = o.next;
    }
  }
}
function Oe(e, t = 0, n, r, i, o) {
  let s = S(),
    a = te(),
    l = r ? e + 1 : null;
  l !== null && Oc(s, a, l, r, i, o, null, n);
  let c = dr(a, q + e, 16, null, n || null);
  (c.projection === null && (c.projection = t), gl());
  let d = !s[Wn] || dl();
  s[Ee][pe].projection[c.projection] === null && l !== null
    ? Lb(s, a, l)
    : d && !us(c) && Uy(a, s, c);
}
function Lb(e, t, n) {
  let r = q + n,
    i = t.data[r],
    o = e[r],
    s = Hl(o, i.tView.ssrId),
    a = Cc(e, i, void 0, { dehydratedView: s });
  Ic(o, a, 0, Jo(i, s));
}
function Mn(e, t, n, r) {
  sp(e, t, n, r);
}
function Ge(e, t, n) {
  op(e, t, n);
}
function fe(e) {
  let t = S(),
    n = te(),
    r = ko();
  Gr(r + 1);
  let i = xc(n, r);
  if (e.dirty && Kd(t) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) e.reset([]);
    else {
      let o = lp(t, r);
      (e.reset(o, dh), e.notifyOnChanges());
    }
    return !0;
  }
  return !1;
}
function he() {
  return Sc(S(), ko());
}
function Hc(e, t, n, r, i) {
  up(t, sp(e, n, r, i));
}
function pr(e, t, n, r) {
  up(e, op(t, n, r));
}
function Es(e = 1) {
  Gr(ko() + e);
}
function mr(e) {
  let t = sf();
  return Qd(t, q + e);
}
function Ho(e, t) {
  return (e << 17) | (t << 2);
}
function Cn(e) {
  return (e >> 17) & 32767;
}
function jb(e) {
  return (e & 2) == 2;
}
function Vb(e, t) {
  return (e & 131071) | (t << 17);
}
function ec(e) {
  return e | 2;
}
function ar(e) {
  return (e & 131068) >> 2;
}
function xl(e, t) {
  return (e & -131069) | (t << 2);
}
function Bb(e) {
  return (e & 1) === 1;
}
function tc(e) {
  return e | 1;
}
function Ub(e, t, n, r, i, o) {
  let s = o ? t.classBindings : t.styleBindings,
    a = Cn(s),
    l = ar(s);
  e[r] = n;
  let c = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    ((u = d[1]), (u === null || zn(d, u) > 0) && (c = !0));
  } else u = n;
  if (i)
    if (l !== 0) {
      let p = Cn(e[a + 1]);
      ((e[r + 1] = Ho(p, a)),
        p !== 0 && (e[p + 1] = xl(e[p + 1], r)),
        (e[a + 1] = Vb(e[a + 1], r)));
    } else ((e[r + 1] = Ho(a, 0)), a !== 0 && (e[a + 1] = xl(e[a + 1], r)), (a = r));
  else ((e[r + 1] = Ho(l, 0)), a === 0 ? (a = r) : (e[l + 1] = xl(e[l + 1], r)), (l = r));
  (c && (e[r + 1] = ec(e[r + 1])),
    Wf(e, u, r, !0),
    Wf(e, u, r, !1),
    Hb(t, u, e, r, o),
    (s = Ho(a, l)),
    o ? (t.classBindings = s) : (t.styleBindings = s));
}
function Hb(e, t, n, r, i) {
  let o = i ? e.residualClasses : e.residualStyles;
  o != null && typeof t == 'string' && zn(o, t) >= 0 && (n[r + 1] = tc(n[r + 1]));
}
function Wf(e, t, n, r) {
  let i = e[n + 1],
    o = t === null,
    s = r ? Cn(i) : ar(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let l = e[s],
      c = e[s + 1];
    ($b(l, t) && ((a = !0), (e[s + 1] = r ? tc(c) : ec(c))), (s = r ? Cn(c) : ar(c)));
  }
  a && (e[n + 1] = r ? ec(i) : tc(i));
}
function $b(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == 'string'
      ? zn(e, t) >= 0
      : !1;
}
function Fe(e, t) {
  return (zb(e, t, null, !0), Fe);
}
function zb(e, t, n, r) {
  let i = S(),
    o = te(),
    s = lf(2);
  if ((o.firstUpdatePass && Wb(o, e, s, r), t !== gt && fr(i, s, t))) {
    let a = o.data[yn()];
    Kb(o, a, i, i[H], e, (i[s + 1] = Xb(t, n)), r, s);
  }
}
function Gb(e, t) {
  return t >= e.expandoStartIndex;
}
function Wb(e, t, n, r) {
  let i = e.data;
  if (i[n + 1] === null) {
    let o = i[yn()],
      s = Gb(e, n);
    (Jb(o, r) && t === null && !s && (t = !1), (t = qb(i, o, t, r)), Ub(i, o, t, n, s, r));
  }
}
function qb(e, t, n, r) {
  let i = ff(e),
    o = r ? t.residualClasses : t.residualStyles;
  if (i === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Al(null, e, t, n, r)), (n = ti(n, t.attrs, r)), (o = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== i)
      if (((n = Al(i, e, t, n, r)), o === null)) {
        let l = Zb(e, t, r);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = Al(null, e, t, l[1], r)), (l = ti(l, t.attrs, r)), Yb(e, t, r, l));
      } else o = Qb(e, t, r);
  }
  return (o !== void 0 && (r ? (t.residualClasses = o) : (t.residualStyles = o)), n);
}
function Zb(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (ar(r) !== 0) return e[Cn(r)];
}
function Yb(e, t, n, r) {
  let i = n ? t.classBindings : t.styleBindings;
  e[Cn(i)] = r;
}
function Qb(e, t, n) {
  let r,
    i = t.directiveEnd;
  for (let o = 1 + t.directiveStylingLast; o < i; o++) {
    let s = e[o].hostAttrs;
    r = ti(r, s, n);
  }
  return ti(r, t.attrs, n);
}
function Al(e, t, n, r, i) {
  let o = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((o = t[a]), (r = ti(r, o.hostAttrs, i)), o !== e);

  )
    a++;
  return (e !== null && (n.directiveStylingLast = a), r);
}
function ti(e, t, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (t !== null)
    for (let o = 0; o < t.length; o++) {
      let s = t[o];
      typeof s == 'number'
        ? (i = s)
        : i === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]), Bd(e, s, n ? !0 : t[++o]));
    }
  return e === void 0 ? null : e;
}
function Kb(e, t, n, r, i, o, s, a) {
  if (!(t.type & 3)) return;
  let l = e.data,
    c = l[a + 1],
    u = Bb(c) ? qf(l, t, n, i, ar(c), s) : void 0;
  if (!as(u)) {
    as(o) || (jb(c) && (o = qf(l, null, n, i, a, s)));
    let d = il(yn(), n);
    $y(r, s, d, i, o);
  }
}
function qf(e, t, n, r, i, o) {
  let s = t === null,
    a;
  for (; i > 0; ) {
    let l = e[i],
      c = Array.isArray(l),
      u = c ? l[1] : l,
      d = u === null,
      p = n[i + 1];
    p === gt && (p = d ? be : void 0);
    let f = d ? So(p, r) : u === r ? p : void 0;
    if ((c && !as(f) && (f = So(l, r)), as(f) && ((a = f), s))) return a;
    let m = e[i + 1];
    i = s ? Cn(m) : ar(m);
  }
  if (t !== null) {
    let l = o ? t.residualClasses : t.residualStyles;
    l != null && (a = So(l, r));
  }
  return a;
}
function as(e) {
  return e !== void 0;
}
function Xb(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string' ? (e = e + t) : typeof e == 'object' && (e = St(Eh(e)))),
    e
  );
}
function Jb(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
function ot(e, t = '') {
  let n = S(),
    r = te(),
    i = e + q,
    o = r.firstCreatePass ? dr(r, i, 1, t, null) : r.data[i],
    s = eD(r, n, o, t, e);
  ((n[i] = s), Vo() && gc(r, n, s, o), Xn(o, !1));
}
var eD = (e, t, n, r, i) => (Wr(!0), Ey(t[H], r));
function tD(e, t, n, r = '') {
  return fr(e, er(), n) ? t + Io(n) + r : gt;
}
function Tn(e) {
  return (ui('', e), Tn);
}
function ui(e, t, n) {
  let r = S(),
    i = tD(r, e, t, n);
  return (i !== gt && nD(r, yn(), i), ui);
}
function nD(e, t, n) {
  let r = il(t, e);
  Cy(e[H], r, n);
}
function rD(e, t, n) {
  let r = te();
  if (r.firstCreatePass) {
    let i = et(e);
    (nc(n, r.data, r.blueprint, i, !0), nc(t, r.data, r.blueprint, i, !1));
  }
}
function nc(e, t, n, r, i) {
  if (((e = ue(e)), Array.isArray(e))) for (let o = 0; o < e.length; o++) nc(e[o], t, n, r, i);
  else {
    let o = te(),
      s = S(),
      a = ae(),
      l = on(e) ? e : ue(e.provide),
      c = el(e),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (on(e) || !e.multi) {
      let f = new Dn(c, i, le, null),
        m = Rl(l, t, i ? u : u + p, d);
      m === -1
        ? (Fl(Qo(a, s), o, l),
          Nl(o, e, t.length),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[m] = f), (s[m] = f));
    } else {
      let f = Rl(l, t, u + p, d),
        m = Rl(l, t, u, u + p),
        E = f >= 0 && n[f],
        b = m >= 0 && n[m];
      if ((i && !b) || (!i && !E)) {
        Fl(Qo(a, s), o, l);
        let g = sD(i ? oD : iD, n.length, i, r, c, e);
        (!i && b && (n[m].providerFactory = g),
          Nl(o, e, t.length, 0),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(g),
          s.push(g));
      } else {
        let g = wp(n[i ? m : f], c, !i && r);
        Nl(o, e, f > -1 ? f : m, g);
      }
      !i && r && b && n[m].componentProviders++;
    }
  }
}
function Nl(e, t, n, r) {
  let i = on(t),
    o = Gd(t);
  if (i || o) {
    let l = (o ? ue(t.useClass) : t).prototype.ngOnDestroy;
    if (l) {
      let c = e.destroyHooks || (e.destroyHooks = []);
      if (!i && t.multi) {
        let u = c.indexOf(n);
        u === -1 ? c.push(n, [r, l]) : c[u + 1].push(r, l);
      } else c.push(n, l);
    }
  }
}
function wp(e, t, n) {
  return (n && e.componentProviders++, e.multi.push(t) - 1);
}
function Rl(e, t, n, r) {
  for (let i = n; i < r; i++) if (t[i] === e) return i;
  return -1;
}
function iD(e, t, n, r, i) {
  return rc(this.multi, []);
}
function oD(e, t, n, r, i) {
  let o = this.multi,
    s;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      l = Kr(r, r[D], this.providerFactory.index, i);
    ((s = l.slice(0, a)), rc(o, s));
    for (let c = a; c < l.length; c++) s.push(l[c]);
  } else ((s = []), rc(o, s));
  return s;
}
function rc(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function sD(e, t, n, r, i, o) {
  let s = new Dn(e, n, le, null);
  return ((s.multi = []), (s.index = t), (s.componentProviders = 0), wp(s, i, r && !n), s);
}
function bt(e, t = []) {
  return (n) => {
    n.providersResolver = (r, i) => rD(r, i ? i(e) : e, t);
  };
}
function di(e, t) {
  return ms(e, t);
}
var aD = (() => {
  class e {
    zone = h(A);
    changeDetectionScheduler = h(xe);
    applicationRef = h(Ut);
    applicationErrorHandler = h(Ue);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
          next: () => {
            this.changeDetectionScheduler.runningTick ||
              this.zone.run(() => {
                try {
                  ((this.applicationRef.dirtyFlags |= 1), this.applicationRef._tick());
                } catch (n) {
                  this.applicationErrorHandler(n);
                }
              });
          },
        }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function Ip({ ngZoneFactory: e, ignoreChangesOutsideZone: t, scheduleInRootZone: n }) {
  return (
    (e ??= () => new A(R(M({}, Mp()), { scheduleInRootZone: n }))),
    [
      { provide: A, useFactory: e },
      {
        provide: cn,
        multi: !0,
        useFactory: () => {
          let r = h(aD, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: cn,
        multi: !0,
        useFactory: () => {
          let r = h(lD);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: Dl, useValue: !0 } : [],
      { provide: El, useValue: n ?? pp },
      {
        provide: Ue,
        useFactory: () => {
          let r = h(A),
            i = h(ee),
            o;
          return (s) => {
            r.runOutsideAngular(() => {
              i.destroyed && !o
                ? setTimeout(() => {
                    throw s;
                  })
                : ((o ??= i.get(Se)), o.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function Mp(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var lD = (() => {
  class e {
    subscription = new Z();
    initialized = !1;
    zone = h(A);
    pendingTasks = h(ht);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      (!this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              (A.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                }));
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            (A.assertInAngularZone(), (n ??= this.pendingTasks.add()));
          }),
        ));
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var Tp = (() => {
  class e {
    applicationErrorHandler = h(Ue);
    appRef = h(Ut);
    taskService = h(ht);
    ngZone = h(A);
    zonelessEnabled = h(Uo);
    tracing = h(wn, { optional: !0 });
    disableScheduling = h(Dl, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new Z();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(is) : null;
    scheduleInRootZone =
      !this.zonelessEnabled && this.zoneIsDefined && (h(El, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled && (this.ngZone instanceof os || !this.zoneIsDefined)));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      let r = !1;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 12: {
          ((this.appRef.dirtyFlags |= 16), (r = !0));
          break;
        }
        case 13: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 11: {
          r = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let i = this.useMicrotaskScheduler ? Uf : mp;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() => i(() => this.tick())))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              i(() => this.tick()),
            )));
    }
    shouldScheduleTick(n) {
      return !(
        (this.disableScheduling && !n) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(is + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        (this.taskService.remove(n), this.applicationErrorHandler(r));
      } finally {
        this.cleanup();
      }
      ((this.useMicrotaskScheduler = !0),
        Uf(() => {
          ((this.useMicrotaskScheduler = !1), this.taskService.remove(n));
        }));
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(n));
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function cD() {
  return (typeof $localize < 'u' && $localize.locale) || ci;
}
var Cs = new v('', {
  providedIn: 'root',
  factory: () => h(Cs, { optional: !0, skipSelf: !0 }) || cD(),
});
function ke(e) {
  return Id(e);
}
function ye(e, t) {
  return Nr(e, t?.equal);
}
var $c = class {
  [J];
  constructor(t) {
    this[J] = t;
  }
  destroy() {
    this[J].destroy();
  }
};
function Dt(e, t) {
  let n = t?.injector ?? h(De),
    r = t?.manualCleanup !== !0 ? n.get(Be) : null,
    i,
    o = n.get(tr, null, { optional: !0 }),
    s = n.get(xe);
  return (
    o !== null
      ? ((i = fD(o.view, s, e)), r instanceof jr && r._lView === o.view && (r = null))
      : (i = hD(e, n.get(Zr), s)),
    (i.injector = n),
    r !== null && (i.onDestroyFn = r.onDestroy(() => i.destroy())),
    new $c(i)
  );
}
var Sp = R(M({}, Md), {
    cleanupFns: void 0,
    zone: null,
    onDestroyFn: _n,
    run() {
      let e = Jn(!1);
      try {
        Td(this);
      } finally {
        Jn(e);
      }
    },
    cleanup() {
      if (!this.cleanupFns?.length) return;
      let e = w(null);
      try {
        for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
      } finally {
        ((this.cleanupFns = []), w(e));
      }
    },
  }),
  uD = R(M({}, Sp), {
    consumerMarkedDirty() {
      (this.scheduler.schedule(this), this.notifier.notify(12));
    },
    destroy() {
      (It(this), this.onDestroyFn(), this.cleanup(), this.scheduler.remove(this));
    },
  }),
  dD = R(M({}, Sp), {
    consumerMarkedDirty() {
      ((this.view[C] |= 8192), kt(this.view), this.notifier.notify(13));
    },
    destroy() {
      (It(this), this.onDestroyFn(), this.cleanup(), this.view[ft]?.delete(this));
    },
  });
function fD(e, t, n) {
  let r = Object.create(dD);
  return (
    (r.view = e),
    (r.zone = typeof Zone < 'u' ? Zone.current : null),
    (r.notifier = t),
    (r.fn = xp(r, n)),
    (e[ft] ??= new Set()),
    e[ft].add(r),
    r.consumerMarkedDirty(r),
    r
  );
}
function hD(e, t, n) {
  let r = Object.create(uD);
  return (
    (r.fn = xp(r, e)),
    (r.scheduler = t),
    (r.notifier = n),
    (r.zone = typeof Zone < 'u' ? Zone.current : null),
    r.scheduler.add(r),
    r.notifier.notify(12),
    r
  );
}
function xp(e, t) {
  return () => {
    t((n) => (e.cleanupFns ??= []).push(n));
  };
}
var Fp = Symbol('InputSignalNode#UNSET'),
  FD = R(M({}, Rr), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
      On(e, t);
    },
  });
function kp(e, t) {
  let n = Object.create(FD);
  ((n.value = e), (n.transformFn = t?.transform));
  function r() {
    if ((Wt(n), n.value === Fp)) {
      let i = null;
      throw new y(-950, i);
    }
    return n.value;
  }
  return ((r[J] = n), r);
}
var kD = new v('');
kD.__NG_ELEMENT_ID__ = (e) => {
  let t = ae();
  if (t === null) throw new y(204, !1);
  if (t.type & 2) return t.value;
  if (e & 8) return null;
  throw new y(204, !1);
};
function Ap(e, t) {
  return kp(e, t);
}
function PD(e) {
  return kp(Fp, e);
}
var Pp = ((Ap.required = PD), Ap);
function Np(e, t) {
  return Ac(t);
}
function LD(e, t) {
  return Nc(t);
}
var hi = ((Np.required = LD), Np);
function Rp(e, t) {
  return Ac(t);
}
function jD(e, t) {
  return Nc(t);
}
var Lp = ((Rp.required = jD), Rp);
var Gc = new v(''),
  VD = new v('');
function fi(e) {
  return !e.moduleRef;
}
function BD(e) {
  let t = fi(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(A);
  return n.run(() => {
    fi(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(Ue),
      i;
    if (
      (n.runOutsideAngular(() => {
        i = n.onError.subscribe({ next: r });
      }),
      fi(e))
    ) {
      let o = () => t.destroy(),
        s = e.platformInjector.get(Gc);
      (s.add(o),
        t.onDestroy(() => {
          (i.unsubscribe(), s.delete(o));
        }));
    } else {
      let o = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(Gc);
      (s.add(o),
        e.moduleRef.onDestroy(() => {
          (Qr(e.allPlatformModules, e.moduleRef), i.unsubscribe(), s.delete(o));
        }));
    }
    return HD(r, n, () => {
      let o = t.get(ht),
        s = o.add(),
        a = t.get(Bc);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let l = t.get(Cs, ci);
            if ((Cp(l || ci), !t.get(VD, !0)))
              return fi(e) ? t.get(Ut) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (fi(e)) {
              let u = t.get(Ut);
              return (e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u);
            } else return (UD?.(e.moduleRef, e.allPlatformModules), e.moduleRef);
          })
          .finally(() => void o.remove(s))
      );
    });
  });
}
var UD;
function HD(e, t, n) {
  try {
    let r = n();
    return In(r)
      ? r.catch((i) => {
          throw (t.runOutsideAngular(() => e(i)), i);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e(r)), r);
  }
}
var ws = null;
function $D(e = [], t) {
  return De.create({
    name: t,
    providers: [
      { provide: Br, useValue: 'platform' },
      { provide: Gc, useValue: new Set([() => (ws = null)]) },
      ...e,
    ],
  });
}
function zD(e = []) {
  if (ws) return ws;
  let t = $D(e);
  return ((ws = t), bp(), GD(t), t);
}
function GD(e) {
  let t = e.get(cs, null);
  un(e, () => {
    t?.forEach((n) => n());
  });
}
var gr = (() => {
  class e {
    static __NG_ELEMENT_ID__ = WD;
  }
  return e;
})();
function WD(e) {
  return qD(ae(), S(), (e & 16) === 16);
}
function qD(e, t, n) {
  if (Ft(e) && !n) {
    let r = Re(e.index, t);
    return new Lt(r, r);
  } else if (e.type & 175) {
    let r = t[Ee];
    return new Lt(r, t);
  }
  return null;
}
function jp(e) {
  let { rootComponent: t, appProviders: n, platformProviders: r, platformRef: i } = e;
  O(8);
  try {
    let o = i?.injector ?? zD(r),
      s = [Ip({}), { provide: xe, useExisting: Tp }, bf, ...(n || [])],
      a = new ei({ providers: s, parent: o, debugName: '', runEnvironmentInitializers: !1 });
    return BD({ r3Injector: a.injector, platformInjector: o, rootComponent: t });
  } catch (o) {
    return Promise.reject(o);
  } finally {
    O(9);
  }
}
function pi(e) {
  return typeof e == 'boolean' ? e : e != null && e !== 'false';
}
var zc = Symbol('NOT_SET'),
  Vp = new Set(),
  ZD = R(M({}, Rr), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    value: zc,
    cleanup: null,
    consumerMarkedDirty() {
      if (this.sequence.impl.executing) {
        if (this.sequence.lastPhase === null || this.sequence.lastPhase < this.phase) return;
        this.sequence.erroredOrDestroyed = !0;
      }
      this.sequence.scheduler.notify(7);
    },
    phaseFn(e) {
      if (((this.sequence.lastPhase = this.phase), !this.dirty)) return this.signal;
      if (((this.dirty = !1), this.value !== zc && !Zt(this))) return this.signal;
      try {
        for (let i of this.cleanup ?? Vp) i();
      } finally {
        this.cleanup?.clear();
      }
      let t = [];
      (e !== void 0 && t.push(e), t.push(this.registerCleanupFn));
      let n = wt(this),
        r;
      try {
        r = this.userFn.apply(null, t);
      } finally {
        qt(this, n);
      }
      return (
        (this.value === zc || !this.equal(this.value, r)) && ((this.value = r), this.version++),
        this.signal
      );
    },
  }),
  Wc = class extends ss {
    scheduler;
    lastPhase = null;
    nodes = [void 0, void 0, void 0, void 0];
    constructor(t, n, r, i, o, s = null) {
      (super(t, [void 0, void 0, void 0, void 0], r, !1, o.get(Be), s), (this.scheduler = i));
      for (let a of Lc) {
        let l = n[a];
        if (l === void 0) continue;
        let c = Object.create(ZD);
        ((c.sequence = this),
          (c.phase = a),
          (c.userFn = l),
          (c.dirty = !0),
          (c.signal = () => (Wt(c), c.value)),
          (c.signal[J] = c),
          (c.registerCleanupFn = (u) => (c.cleanup ??= new Set()).add(u)),
          (this.nodes[a] = c),
          (this.hooks[a] = (u) => c.phaseFn(u)));
      }
    }
    afterRun() {
      (super.afterRun(), (this.lastPhase = null));
    }
    destroy() {
      super.destroy();
      for (let t of this.nodes)
        if (t)
          try {
            for (let n of t.cleanup ?? Vp) n();
          } finally {
            It(t);
          }
    }
  };
function Bp(e, t) {
  let n = t?.injector ?? h(De),
    r = n.get(xe),
    i = n.get(Pc),
    o = n.get(wn, null, { optional: !0 });
  i.impl ??= n.get(vp);
  let s = e;
  typeof s == 'function' && (s = { mixedReadWrite: e });
  let a = n.get(tr, null, { optional: !0 }),
    l = new Wc(
      i.impl,
      [s.earlyRead, s.write, s.mixedReadWrite, s.read],
      a?.view,
      r,
      n,
      o?.snapshot(null),
    );
  return (i.impl.register(l), l);
}
function Up(e, t) {
  let n = Nt(e),
    r = t.elementInjector || Gn();
  return new sr(n).create(
    r,
    t.projectableNodes,
    t.hostElement,
    t.environmentInjector,
    t.directives,
    t.bindings,
  );
}
var Hp = null;
function gi() {
  return Hp;
}
function Zc(e) {
  Hp ??= e;
}
var mi = class {};
var Yc = (() => {
    class e {
      _viewContainer;
      _context = new Is();
      _thenTemplateRef = null;
      _elseTemplateRef = null;
      _thenViewRef = null;
      _elseViewRef = null;
      constructor(n, r) {
        ((this._viewContainer = n), (this._thenTemplateRef = r));
      }
      set ngIf(n) {
        ((this._context.$implicit = this._context.ngIf = n), this._updateView());
      }
      set ngIfThen(n) {
        ($p(n, !1), (this._thenTemplateRef = n), (this._thenViewRef = null), this._updateView());
      }
      set ngIfElse(n) {
        ($p(n, !1), (this._elseTemplateRef = n), (this._elseViewRef = null), this._updateView());
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context,
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context,
              )));
      }
      static ngIfUseIfTypeGuard;
      static ngTemplateGuard_ngIf;
      static ngTemplateContextGuard(n, r) {
        return !0;
      }
      static ɵfac = function (r) {
        return new (r || e)(le(vt), le(En));
      };
      static ɵdir = $({
        type: e,
        selectors: [['', 'ngIf', '']],
        inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
      });
    }
    return e;
  })(),
  Is = class {
    $implicit = null;
    ngIf = null;
  };
function $p(e, t) {
  if (e && !e.createEmbeddedView) throw new y(2020, !1);
}
var Qc = (() => {
  class e {
    _viewContainerRef;
    _viewRef = null;
    ngTemplateOutletContext = null;
    ngTemplateOutlet = null;
    ngTemplateOutletInjector = null;
    constructor(n) {
      this._viewContainerRef = n;
    }
    ngOnChanges(n) {
      if (this._shouldRecreateView(n)) {
        let r = this._viewContainerRef;
        if ((this._viewRef && r.remove(r.indexOf(this._viewRef)), !this.ngTemplateOutlet)) {
          this._viewRef = null;
          return;
        }
        let i = this._createContextForwardProxy();
        this._viewRef = r.createEmbeddedView(this.ngTemplateOutlet, i, {
          injector: this.ngTemplateOutletInjector ?? void 0,
        });
      }
    }
    _shouldRecreateView(n) {
      return !!n.ngTemplateOutlet || !!n.ngTemplateOutletInjector;
    }
    _createContextForwardProxy() {
      return new Proxy(
        {},
        {
          set: (n, r, i) =>
            this.ngTemplateOutletContext ? Reflect.set(this.ngTemplateOutletContext, r, i) : !1,
          get: (n, r, i) => {
            if (this.ngTemplateOutletContext)
              return Reflect.get(this.ngTemplateOutletContext, r, i);
          },
        },
      );
    }
    static ɵfac = function (r) {
      return new (r || e)(le(vt));
    };
    static ɵdir = $({
      type: e,
      selectors: [['', 'ngTemplateOutlet', '']],
      inputs: {
        ngTemplateOutletContext: 'ngTemplateOutletContext',
        ngTemplateOutlet: 'ngTemplateOutlet',
        ngTemplateOutletInjector: 'ngTemplateOutletInjector',
      },
      features: [it],
    });
  }
  return e;
})();
var Ms = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = re({ type: e });
    static ɵinj = Y({});
  }
  return e;
})();
function vi(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(';')) {
    let r = n.indexOf('='),
      [i, o] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === t) return decodeURIComponent(o);
  }
  return null;
}
var Sn = class {};
var Kc = 'browser';
function zp(e) {
  return e === Kc;
}
var Ss = new v(''),
  nu = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(n, r) {
        ((this._zone = r),
          n.forEach((i) => {
            i.manager = this;
          }),
          (this._plugins = n.slice().reverse()));
      }
      addEventListener(n, r, i, o) {
        return this._findPluginFor(r).addEventListener(n, r, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((o) => o.supports(n))), !r)) throw new y(5101, !1);
        return (this._eventNameToPlugin.set(n, r), r);
      }
      static ɵfac = function (r) {
        return new (r || e)(I(Ss), I(A));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  yi = class {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    manager;
  },
  Xc = 'ng-app-id';
function Gp(e) {
  for (let t of e) t.remove();
}
function Wp(e, t) {
  let n = t.createElement('style');
  return ((n.textContent = e), n);
}
function KD(e, t, n, r) {
  let i = e.head?.querySelectorAll(`style[${Xc}="${t}"],link[${Xc}="${t}"]`);
  if (i)
    for (let o of i)
      (o.removeAttribute(Xc),
        o instanceof HTMLLinkElement
          ? r.set(o.href.slice(o.href.lastIndexOf('/') + 1), { usage: 0, elements: [o] })
          : o.textContent && n.set(o.textContent, { usage: 0, elements: [o] }));
}
function eu(e, t) {
  let n = t.createElement('link');
  return (n.setAttribute('rel', 'stylesheet'), n.setAttribute('href', e), n);
}
var ru = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(n, r, i, o = {}) {
        ((this.doc = n),
          (this.appId = r),
          (this.nonce = i),
          KD(n, r, this.inline, this.external),
          this.hosts.add(n.head));
      }
      addStyles(n, r) {
        for (let i of n) this.addUsage(i, this.inline, Wp);
        r?.forEach((i) => this.addUsage(i, this.external, eu));
      }
      removeStyles(n, r) {
        for (let i of n) this.removeUsage(i, this.inline);
        r?.forEach((i) => this.removeUsage(i, this.external));
      }
      addUsage(n, r, i) {
        let o = r.get(n);
        o
          ? o.usage++
          : r.set(n, {
              usage: 1,
              elements: [...this.hosts].map((s) => this.addElement(s, i(n, this.doc))),
            });
      }
      removeUsage(n, r) {
        let i = r.get(n);
        i && (i.usage--, i.usage <= 0 && (Gp(i.elements), r.delete(n)));
      }
      ngOnDestroy() {
        for (let [, { elements: n }] of [...this.inline, ...this.external]) Gp(n);
        this.hosts.clear();
      }
      addHost(n) {
        this.hosts.add(n);
        for (let [r, { elements: i }] of this.inline) i.push(this.addElement(n, Wp(r, this.doc)));
        for (let [r, { elements: i }] of this.external) i.push(this.addElement(n, eu(r, this.doc)));
      }
      removeHost(n) {
        this.hosts.delete(n);
      }
      addElement(n, r) {
        return (this.nonce && r.setAttribute('nonce', this.nonce), n.appendChild(r));
      }
      static ɵfac = function (r) {
        return new (r || e)(I(oe), I(cr), I(ur, 8), I(jt));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Jc = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  iu = /%COMP%/g;
var Zp = '%COMP%',
  XD = `_nghost-${Zp}`,
  JD = `_ngcontent-${Zp}`,
  eE = !0,
  tE = new v('', { providedIn: 'root', factory: () => eE });
function nE(e) {
  return JD.replace(iu, e);
}
function rE(e) {
  return XD.replace(iu, e);
}
function Yp(e, t) {
  return t.map((n) => n.replace(iu, e));
}
var ou = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      constructor(n, r, i, o, s, a, l, c = null, u = null) {
        ((this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = l),
          (this.nonce = c),
          (this.tracingService = u),
          (this.platformIsServer = !1),
          (this.defaultRenderer = new _i(n, s, l, this.platformIsServer, this.tracingService)));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        let i = this.getOrCreateRenderer(n, r);
        return (i instanceof Ts ? i.applyToHost(n) : i instanceof bi && i.applyStyles(), i);
      }
      getOrCreateRenderer(n, r) {
        let i = this.rendererByCompId,
          o = i.get(r.id);
        if (!o) {
          let s = this.doc,
            a = this.ngZone,
            l = this.eventManager,
            c = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer,
            p = this.tracingService;
          switch (r.encapsulation) {
            case pt.Emulated:
              o = new Ts(l, c, r, this.appId, u, s, a, d, p);
              break;
            case pt.ShadowDom:
              return new tu(l, c, n, r, s, a, this.nonce, d, p);
            default:
              o = new bi(l, c, r, u, s, a, d, p);
              break;
          }
          i.set(r.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(n) {
        this.rendererByCompId.delete(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(I(nu), I(ru), I(cr), I(tE), I(oe), I(jt), I(A), I(ur), I(wn, 8));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  _i = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(t, n, r, i, o) {
      ((this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.tracingService = o));
    }
    destroy() {}
    destroyNode = null;
    createElement(t, n) {
      return n ? this.doc.createElementNS(Jc[n] || n, t) : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (qp(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (qp(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == 'string' ? this.doc.querySelector(t) : t;
      if (!r) throw new y(-5104, !1);
      return (n || (r.textContent = ''), r);
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, i) {
      if (i) {
        n = i + ':' + n;
        let o = Jc[i];
        o ? t.setAttributeNS(o, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let i = Jc[r];
        i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, i) {
      i & (rt.DashCase | rt.Important)
        ? t.style.setProperty(n, r, i & rt.Important ? 'important' : '')
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & rt.DashCase ? t.style.removeProperty(n) : (t.style[n] = '');
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r, i) {
      if (typeof t == 'string' && ((t = gi().getGlobalEventTarget(this.doc, t)), !t))
        throw new y(5102, !1);
      let o = this.decoratePreventDefault(r);
      return (
        this.tracingService?.wrapEventListener &&
          (o = this.tracingService.wrapEventListener(t, n, o)),
        this.eventManager.addEventListener(t, n, o, i)
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === '__ngUnwrap__') return t;
        t(n) === !1 && n.preventDefault();
      };
    }
  };
function qp(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0;
}
var tu = class extends _i {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(t, n, r, i, o, s, a, l, c) {
      (super(t, o, s, l, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot));
      let u = i.styles;
      u = Yp(i.id, u);
      for (let p of u) {
        let f = document.createElement('style');
        (a && f.setAttribute('nonce', a), (f.textContent = p), this.shadowRoot.appendChild(f));
      }
      let d = i.getExternalStyles?.();
      if (d)
        for (let p of d) {
          let f = eu(p, o);
          (a && f.setAttribute('nonce', a), this.shadowRoot.appendChild(f));
        }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  bi = class extends _i {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(t, n, r, i, o, s, a, l, c) {
      (super(t, o, s, a, l), (this.sharedStylesHost = n), (this.removeStylesOnCompDestroy = i));
      let u = r.styles;
      ((this.styles = c ? Yp(c, u) : u), (this.styleUrls = r.getExternalStyles?.(c)));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        fs.size === 0 &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  Ts = class extends bi {
    contentAttr;
    hostAttr;
    constructor(t, n, r, i, o, s, a, l, c) {
      let u = i + '-' + r.id;
      (super(t, n, r, o, s, a, l, c, u), (this.contentAttr = nE(u)), (this.hostAttr = rE(u)));
    }
    applyToHost(t) {
      (this.applyStyles(), this.setAttribute(t, this.hostAttr, ''));
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return (super.setAttribute(r, this.contentAttr, ''), r);
    }
  };
var xs = class e extends mi {
    supportsDOMEvents = !0;
    static makeCurrent() {
      Zc(new e());
    }
    onAndCancel(t, n, r, i) {
      return (
        t.addEventListener(n, r, i),
        () => {
          t.removeEventListener(n, r, i);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return ((n = n || this.getDefaultDocument()), n.createElement(t));
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === 'window' ? window : n === 'document' ? t : n === 'body' ? t.body : null;
    }
    getBaseHref(t) {
      let n = iE();
      return n == null ? null : oE(n);
    }
    resetBaseElement() {
      Di = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return vi(document.cookie, t);
    }
  },
  Di = null;
function iE() {
  return ((Di = Di || document.head.querySelector('base')), Di ? Di.getAttribute('href') : null);
}
function oE(e) {
  return new URL(e, document.baseURI).pathname;
}
var sE = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Kp = (() => {
    class e extends yi {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, i, o) {
        return (n.addEventListener(r, i, o), () => this.removeEventListener(n, r, i, o));
      }
      removeEventListener(n, r, i, o) {
        return n.removeEventListener(r, i, o);
      }
      static ɵfac = function (r) {
        return new (r || e)(I(oe));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Qp = ['alt', 'control', 'meta', 'shift'],
  aE = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  lE = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Xp = (() => {
    class e extends yi {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, i, o) {
        let s = e.parseEventName(r),
          a = e.eventCallback(s.fullKey, i, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => gi().onAndCancel(n, s.domEventName, a, o));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split('.'),
          i = r.shift();
        if (r.length === 0 || !(i === 'keydown' || i === 'keyup')) return null;
        let o = e._normalizeKey(r.pop()),
          s = '',
          a = r.indexOf('code');
        if (
          (a > -1 && (r.splice(a, 1), (s = 'code.')),
          Qp.forEach((c) => {
            let u = r.indexOf(c);
            u > -1 && (r.splice(u, 1), (s += c + '.'));
          }),
          (s += o),
          r.length != 0 || o.length === 0)
        )
          return null;
        let l = {};
        return ((l.domEventName = i), (l.fullKey = s), l);
      }
      static matchEventFullKeyCode(n, r) {
        let i = aE[n.key] || n.key,
          o = '';
        return (
          r.indexOf('code.') > -1 && ((i = n.code), (o = 'code.')),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === ' ' ? (i = 'space') : i === '.' && (i = 'dot'),
              Qp.forEach((s) => {
                if (s !== i) {
                  let a = lE[s];
                  a(n) && (o += s + '.');
                }
              }),
              (o += i),
              o === r)
        );
      }
      static eventCallback(n, r, i) {
        return (o) => {
          e.matchEventFullKeyCode(o, n) && i.runGuarded(() => r(o));
        };
      }
      static _normalizeKey(n) {
        return n === 'esc' ? 'escape' : n;
      }
      static ɵfac = function (r) {
        return new (r || e)(I(oe));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function su(e, t, n) {
  let r = M({ rootComponent: e, platformRef: n?.platformRef }, cE(t));
  return jp(r);
}
function cE(e) {
  return { appProviders: [...pE, ...(e?.providers ?? [])], platformProviders: hE };
}
function uE() {
  xs.makeCurrent();
}
function dE() {
  return new Se();
}
function fE() {
  return (sc(document), document);
}
var hE = [
  { provide: jt, useValue: Kc },
  { provide: cs, useValue: uE, multi: !0 },
  { provide: oe, useFactory: fE },
];
var pE = [
  { provide: Br, useValue: 'root' },
  { provide: Se, useFactory: dE },
  { provide: Ss, useClass: Kp, multi: !0, deps: [oe] },
  { provide: Ss, useClass: Xp, multi: !0, deps: [oe] },
  ou,
  ru,
  nu,
  { provide: mt, useExisting: ou },
  { provide: Sn, useClass: sE },
  [],
];
var yr = class {},
  _r = class {},
  at = class e {
    headers;
    normalizedNames = new Map();
    lazyInit;
    lazyUpdate = null;
    constructor(t) {
      t
        ? typeof t == 'string'
          ? (this.lazyInit = () => {
              ((this.headers = new Map()),
                t
                  .split(
                    `
`,
                  )
                  .forEach((n) => {
                    let r = n.indexOf(':');
                    if (r > 0) {
                      let i = n.slice(0, r),
                        o = n.slice(r + 1).trim();
                      this.addHeaderEntry(i, o);
                    }
                  }));
            })
          : typeof Headers < 'u' && t instanceof Headers
            ? ((this.headers = new Map()),
              t.forEach((n, r) => {
                this.addHeaderEntry(r, n);
              }))
            : (this.lazyInit = () => {
                ((this.headers = new Map()),
                  Object.entries(t).forEach(([n, r]) => {
                    this.setHeaderEntries(n, r);
                  }));
              })
        : (this.headers = new Map());
    }
    has(t) {
      return (this.init(), this.headers.has(t.toLowerCase()));
    }
    get(t) {
      this.init();
      let n = this.headers.get(t.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return (this.init(), Array.from(this.normalizedNames.values()));
    }
    getAll(t) {
      return (this.init(), this.headers.get(t.toLowerCase()) || null);
    }
    append(t, n) {
      return this.clone({ name: t, value: n, op: 'a' });
    }
    set(t, n) {
      return this.clone({ name: t, value: n, op: 's' });
    }
    delete(t, n) {
      return this.clone({ name: t, value: n, op: 'd' });
    }
    maybeSetNormalizedName(t, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)), (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      (t.init(),
        Array.from(t.headers.keys()).forEach((n) => {
          (this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n)));
        }));
    }
    clone(t) {
      let n = new e();
      return (
        (n.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        n
      );
    }
    applyUpdate(t) {
      let n = t.name.toLowerCase();
      switch (t.op) {
        case 'a':
        case 's':
          let r = t.value;
          if ((typeof r == 'string' && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(t.name, n);
          let i = (t.op === 'a' ? this.headers.get(n) : void 0) || [];
          (i.push(...r), this.headers.set(n, i));
          break;
        case 'd':
          let o = t.value;
          if (!o) (this.headers.delete(n), this.normalizedNames.delete(n));
          else {
            let s = this.headers.get(n);
            if (!s) return;
            ((s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s));
          }
          break;
      }
    }
    addHeaderEntry(t, n) {
      let r = t.toLowerCase();
      (this.maybeSetNormalizedName(t, r),
        this.headers.has(r) ? this.headers.get(r).push(n) : this.headers.set(r, [n]));
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((o) => o.toString()),
        i = t.toLowerCase();
      (this.headers.set(i, r), this.maybeSetNormalizedName(t, i));
    }
    forEach(t) {
      (this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          t(this.normalizedNames.get(n), this.headers.get(n)),
        ));
    }
  };
var Rs = class {
  encodeKey(t) {
    return Jp(t);
  }
  encodeValue(t) {
    return Jp(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function mE(e, t) {
  let n = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, '')
        .split('&')
        .forEach((i) => {
          let o = i.indexOf('='),
            [s, a] =
              o == -1
                ? [t.decodeKey(i), '']
                : [t.decodeKey(i.slice(0, o)), t.decodeValue(i.slice(o + 1))],
            l = n.get(s) || [];
          (l.push(a), n.set(s, l));
        }),
    n
  );
}
var gE = /%(\d[a-f0-9])/gi,
  vE = { 40: '@', '3A': ':', 24: '$', '2C': ',', '3B': ';', '3D': '=', '3F': '?', '2F': '/' };
function Jp(e) {
  return encodeURIComponent(e).replace(gE, (t, n) => vE[n] ?? t);
}
function As(e) {
  return `${e}`;
}
var Et = class e {
  map;
  encoder;
  updates = null;
  cloneFrom = null;
  constructor(t = {}) {
    if (((this.encoder = t.encoder || new Rs()), t.fromString)) {
      if (t.fromObject) throw new y(2805, !1);
      this.map = mE(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              i = Array.isArray(r) ? r.map(As) : [As(r)];
            this.map.set(n, i);
          }))
        : (this.map = null);
  }
  has(t) {
    return (this.init(), this.map.has(t));
  }
  get(t) {
    this.init();
    let n = this.map.get(t);
    return n ? n[0] : null;
  }
  getAll(t) {
    return (this.init(), this.map.get(t) || null);
  }
  keys() {
    return (this.init(), Array.from(this.map.keys()));
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: 'a' });
  }
  appendAll(t) {
    let n = [];
    return (
      Object.keys(t).forEach((r) => {
        let i = t[r];
        Array.isArray(i)
          ? i.forEach((o) => {
              n.push({ param: r, value: o, op: 'a' });
            })
          : n.push({ param: r, value: i, op: 'a' });
      }),
      this.clone(n)
    );
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: 's' });
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: 'd' });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((r) => n + '=' + this.encoder.encodeValue(r))
            .join('&');
        })
        .filter((t) => t !== '')
        .join('&')
    );
  }
  clone(t) {
    let n = new e({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    );
  }
  init() {
    (this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom.keys().forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case 'a':
            case 's':
              let n = (t.op === 'a' ? this.map.get(t.param) : void 0) || [];
              (n.push(As(t.value)), this.map.set(t.param, n));
              break;
            case 'd':
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  i = r.indexOf(As(t.value));
                (i !== -1 && r.splice(i, 1),
                  r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param));
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null)));
  }
};
var Os = class {
  map = new Map();
  set(t, n) {
    return (this.map.set(t, n), this);
  }
  get(t) {
    return (this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t));
  }
  delete(t) {
    return (this.map.delete(t), this);
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function yE(e) {
  switch (e) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return !1;
    default:
      return !0;
  }
}
function em(e) {
  return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer;
}
function tm(e) {
  return typeof Blob < 'u' && e instanceof Blob;
}
function nm(e) {
  return typeof FormData < 'u' && e instanceof FormData;
}
function _E(e) {
  return typeof URLSearchParams < 'u' && e instanceof URLSearchParams;
}
var Ei = 'Content-Type',
  Fs = 'Accept',
  du = 'X-Request-URL',
  im = 'text/plain',
  om = 'application/json',
  sm = `${om}, ${im}, */*`,
  vr = class e {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    withCredentials = !1;
    credentials;
    keepalive = !1;
    cache;
    priority;
    mode;
    redirect;
    referrer;
    integrity;
    responseType = 'json';
    method;
    params;
    urlWithParams;
    transferCache;
    timeout;
    constructor(t, n, r, i) {
      ((this.url = n), (this.method = t.toUpperCase()));
      let o;
      if ((yE(this.method) || i ? ((this.body = r !== void 0 ? r : null), (o = i)) : (o = r), o)) {
        if (
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          (this.keepalive = !!o.keepalive),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          o.priority && (this.priority = o.priority),
          o.cache && (this.cache = o.cache),
          o.credentials && (this.credentials = o.credentials),
          typeof o.timeout == 'number')
        ) {
          if (o.timeout < 1 || !Number.isInteger(o.timeout)) throw new y(2822, '');
          this.timeout = o.timeout;
        }
        (o.mode && (this.mode = o.mode),
          o.redirect && (this.redirect = o.redirect),
          o.integrity && (this.integrity = o.integrity),
          o.referrer && (this.referrer = o.referrer),
          (this.transferCache = o.transferCache));
      }
      if (((this.headers ??= new at()), (this.context ??= new Os()), !this.params))
        ((this.params = new Et()), (this.urlWithParams = n));
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf('?'),
            l = a === -1 ? '?' : a < n.length - 1 ? '&' : '';
          this.urlWithParams = n + l + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == 'string' ||
            em(this.body) ||
            tm(this.body) ||
            nm(this.body) ||
            _E(this.body)
          ? this.body
          : this.body instanceof Et
            ? this.body.toString()
            : typeof this.body == 'object' ||
                typeof this.body == 'boolean' ||
                Array.isArray(this.body)
              ? JSON.stringify(this.body)
              : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || nm(this.body)
        ? null
        : tm(this.body)
          ? this.body.type || null
          : em(this.body)
            ? null
            : typeof this.body == 'string'
              ? im
              : this.body instanceof Et
                ? 'application/x-www-form-urlencoded;charset=UTF-8'
                : typeof this.body == 'object' ||
                    typeof this.body == 'number' ||
                    typeof this.body == 'boolean'
                  ? om
                  : null;
    }
    clone(t = {}) {
      let n = t.method || this.method,
        r = t.url || this.url,
        i = t.responseType || this.responseType,
        o = t.keepalive ?? this.keepalive,
        s = t.priority || this.priority,
        a = t.cache || this.cache,
        l = t.mode || this.mode,
        c = t.redirect || this.redirect,
        u = t.credentials || this.credentials,
        d = t.referrer || this.referrer,
        p = t.integrity || this.integrity,
        f = t.transferCache ?? this.transferCache,
        m = t.timeout ?? this.timeout,
        E = t.body !== void 0 ? t.body : this.body,
        b = t.withCredentials ?? this.withCredentials,
        g = t.reportProgress ?? this.reportProgress,
        K = t.headers || this.headers,
        qe = t.params || this.params,
        X = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (K = Object.keys(t.setHeaders).reduce((Ze, lt) => Ze.set(lt, t.setHeaders[lt]), K)),
        t.setParams &&
          (qe = Object.keys(t.setParams).reduce((Ze, lt) => Ze.set(lt, t.setParams[lt]), qe)),
        new e(n, r, E, {
          params: qe,
          headers: K,
          context: X,
          reportProgress: g,
          responseType: i,
          withCredentials: b,
          transferCache: f,
          keepalive: o,
          cache: a,
          priority: s,
          timeout: m,
          mode: l,
          redirect: c,
          credentials: u,
          referrer: d,
          integrity: p,
        })
      );
    }
  },
  Ct = (function (e) {
    return (
      (e[(e.Sent = 0)] = 'Sent'),
      (e[(e.UploadProgress = 1)] = 'UploadProgress'),
      (e[(e.ResponseHeader = 2)] = 'ResponseHeader'),
      (e[(e.DownloadProgress = 3)] = 'DownloadProgress'),
      (e[(e.Response = 4)] = 'Response'),
      (e[(e.User = 5)] = 'User'),
      e
    );
  })(Ct || {}),
  br = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    redirected;
    constructor(t, n = 200, r = 'OK') {
      ((this.headers = t.headers || new at()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.redirected = t.redirected),
        (this.ok = this.status >= 200 && this.status < 300));
    }
  },
  Ci = class e extends br {
    constructor(t = {}) {
      super(t);
    }
    type = Ct.ResponseHeader;
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Dr = class e extends br {
    body;
    constructor(t = {}) {
      (super(t), (this.body = t.body !== void 0 ? t.body : null));
    }
    type = Ct.Response;
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
        redirected: t.redirected ?? this.redirected,
      });
    }
  },
  st = class extends br {
    name = 'HttpErrorResponse';
    message;
    error;
    ok = !1;
    constructor(t) {
      (super(t, 0, 'Unknown Error'),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${t.url || '(unknown url)'}`)
          : (this.message = `Http failure response for ${t.url || '(unknown url)'}: ${t.status} ${t.statusText}`),
        (this.error = t.error || null));
    }
  },
  am = 200,
  bE = 204;
function au(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    credentials: e.credentials,
    transferCache: e.transferCache,
    timeout: e.timeout,
    keepalive: e.keepalive,
    priority: e.priority,
    cache: e.cache,
    mode: e.mode,
    redirect: e.redirect,
    integrity: e.integrity,
    referrer: e.referrer,
  };
}
var Ps = (() => {
    class e {
      handler;
      constructor(n) {
        this.handler = n;
      }
      request(n, r, i = {}) {
        let o;
        if (n instanceof vr) o = n;
        else {
          let l;
          i.headers instanceof at ? (l = i.headers) : (l = new at(i.headers));
          let c;
          (i.params &&
            (i.params instanceof Et ? (c = i.params) : (c = new Et({ fromObject: i.params }))),
            (o = new vr(n, r, i.body !== void 0 ? i.body : null, {
              headers: l,
              context: i.context,
              params: c,
              reportProgress: i.reportProgress,
              responseType: i.responseType || 'json',
              withCredentials: i.withCredentials,
              transferCache: i.transferCache,
              keepalive: i.keepalive,
              priority: i.priority,
              cache: i.cache,
              mode: i.mode,
              redirect: i.redirect,
              credentials: i.credentials,
              referrer: i.referrer,
              integrity: i.integrity,
              timeout: i.timeout,
            })));
        }
        let s = Vn(o).pipe(go((l) => this.handler.handle(l)));
        if (n instanceof vr || i.observe === 'events') return s;
        let a = s.pipe(Ke((l) => l instanceof Dr));
        switch (i.observe || 'body') {
          case 'body':
            switch (o.responseType) {
              case 'arraybuffer':
                return a.pipe(
                  U((l) => {
                    if (l.body !== null && !(l.body instanceof ArrayBuffer)) throw new y(2806, !1);
                    return l.body;
                  }),
                );
              case 'blob':
                return a.pipe(
                  U((l) => {
                    if (l.body !== null && !(l.body instanceof Blob)) throw new y(2807, !1);
                    return l.body;
                  }),
                );
              case 'text':
                return a.pipe(
                  U((l) => {
                    if (l.body !== null && typeof l.body != 'string') throw new y(2808, !1);
                    return l.body;
                  }),
                );
              case 'json':
              default:
                return a.pipe(U((l) => l.body));
            }
          case 'response':
            return a;
          default:
            throw new y(2809, !1);
        }
      }
      delete(n, r = {}) {
        return this.request('DELETE', n, r);
      }
      get(n, r = {}) {
        return this.request('GET', n, r);
      }
      head(n, r = {}) {
        return this.request('HEAD', n, r);
      }
      jsonp(n, r) {
        return this.request('JSONP', n, {
          params: new Et().append(r, 'JSONP_CALLBACK'),
          observe: 'body',
          responseType: 'json',
        });
      }
      options(n, r = {}) {
        return this.request('OPTIONS', n, r);
      }
      patch(n, r, i = {}) {
        return this.request('PATCH', n, au(i, r));
      }
      post(n, r, i = {}) {
        return this.request('POST', n, au(i, r));
      }
      put(n, r, i = {}) {
        return this.request('PUT', n, au(i, r));
      }
      static ɵfac = function (r) {
        return new (r || e)(I(yr));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  DE = /^\)\]\}',?\n/;
function rm(e) {
  if (e.url) return e.url;
  let t = du.toLocaleLowerCase();
  return e.headers.get(t);
}
var lm = new v(''),
  Ns = (() => {
    class e {
      fetchImpl = h(lu, { optional: !0 })?.fetch ?? ((...n) => globalThis.fetch(...n));
      ngZone = h(A);
      destroyRef = h(Be);
      destroyed = !1;
      constructor() {
        this.destroyRef.onDestroy(() => {
          this.destroyed = !0;
        });
      }
      handle(n) {
        return new N((r) => {
          let i = new AbortController();
          this.doRequest(n, i.signal, r).then(cu, (s) => r.error(new st({ error: s })));
          let o;
          return (
            n.timeout &&
              (o = this.ngZone.runOutsideAngular(() =>
                setTimeout(() => {
                  i.signal.aborted || i.abort(new DOMException('signal timed out', 'TimeoutError'));
                }, n.timeout),
              )),
            () => {
              (o !== void 0 && clearTimeout(o), i.abort());
            }
          );
        });
      }
      doRequest(n, r, i) {
        return An(this, null, function* () {
          let o = this.createRequestInit(n),
            s;
          try {
            let m = this.ngZone.runOutsideAngular(() =>
              this.fetchImpl(n.urlWithParams, M({ signal: r }, o)),
            );
            (EE(m), i.next({ type: Ct.Sent }), (s = yield m));
          } catch (m) {
            i.error(
              new st({
                error: m,
                status: m.status ?? 0,
                statusText: m.statusText,
                url: n.urlWithParams,
                headers: m.headers,
              }),
            );
            return;
          }
          let a = new at(s.headers),
            l = s.statusText,
            c = rm(s) ?? n.urlWithParams,
            u = s.status,
            d = null;
          if (
            (n.reportProgress && i.next(new Ci({ headers: a, status: u, statusText: l, url: c })),
            s.body)
          ) {
            let m = s.headers.get('content-length'),
              E = [],
              b = s.body.getReader(),
              g = 0,
              K,
              qe,
              X = typeof Zone < 'u' && Zone.current,
              Ze = !1;
            if (
              (yield this.ngZone.runOutsideAngular(() =>
                An(this, null, function* () {
                  for (;;) {
                    if (this.destroyed) {
                      (yield b.cancel(), (Ze = !0));
                      break;
                    }
                    let { done: zt, value: sa } = yield b.read();
                    if (zt) break;
                    if ((E.push(sa), (g += sa.length), n.reportProgress)) {
                      qe =
                        n.responseType === 'text'
                          ? (qe ?? '') + (K ??= new TextDecoder()).decode(sa, { stream: !0 })
                          : void 0;
                      let Hu = () =>
                        i.next({
                          type: Ct.DownloadProgress,
                          total: m ? +m : void 0,
                          loaded: g,
                          partialText: qe,
                        });
                      X ? X.run(Hu) : Hu();
                    }
                  }
                }),
              ),
              Ze)
            ) {
              i.complete();
              return;
            }
            let lt = this.concatChunks(E, g);
            try {
              let zt = s.headers.get(Ei) ?? '';
              d = this.parseBody(n, lt, zt, u);
            } catch (zt) {
              i.error(
                new st({
                  error: zt,
                  headers: new at(s.headers),
                  status: s.status,
                  statusText: s.statusText,
                  url: rm(s) ?? n.urlWithParams,
                }),
              );
              return;
            }
          }
          u === 0 && (u = d ? am : 0);
          let p = u >= 200 && u < 300,
            f = s.redirected;
          p
            ? (i.next(
                new Dr({ body: d, headers: a, status: u, statusText: l, url: c, redirected: f }),
              ),
              i.complete())
            : i.error(
                new st({ error: d, headers: a, status: u, statusText: l, url: c, redirected: f }),
              );
        });
      }
      parseBody(n, r, i, o) {
        switch (n.responseType) {
          case 'json':
            let s = new TextDecoder().decode(r).replace(DE, '');
            if (s === '') return null;
            try {
              return JSON.parse(s);
            } catch (a) {
              if (o < 200 || o >= 300) return s;
              throw a;
            }
          case 'text':
            return new TextDecoder().decode(r);
          case 'blob':
            return new Blob([r], { type: i });
          case 'arraybuffer':
            return r.buffer;
        }
      }
      createRequestInit(n) {
        let r = {},
          i;
        if (
          ((i = n.credentials),
          n.withCredentials && (i = 'include'),
          n.headers.forEach((o, s) => (r[o] = s.join(','))),
          n.headers.has(Fs) || (r[Fs] = sm),
          !n.headers.has(Ei))
        ) {
          let o = n.detectContentTypeHeader();
          o !== null && (r[Ei] = o);
        }
        return {
          body: n.serializeBody(),
          method: n.method,
          headers: r,
          credentials: i,
          keepalive: n.keepalive,
          cache: n.cache,
          priority: n.priority,
          mode: n.mode,
          redirect: n.redirect,
          referrer: n.referrer,
          integrity: n.integrity,
        };
      }
      concatChunks(n, r) {
        let i = new Uint8Array(r),
          o = 0;
        for (let s of n) (i.set(s, o), (o += s.length));
        return i;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  lu = class {};
function cu() {}
function EE(e) {
  e.then(cu, cu);
}
function CE(e, t) {
  return t(e);
}
function wE(e, t, n) {
  return (r, i) => un(n, () => t(r, (o) => e(o, i)));
}
var cm = new v(''),
  um = new v(''),
  dm = new v('', { providedIn: 'root', factory: () => !0 });
var ks = (() => {
  class e extends yr {
    backend;
    injector;
    chain = null;
    pendingTasks = h(qr);
    contributeToStability = h(dm);
    constructor(n, r) {
      (super(), (this.backend = n), (this.injector = r));
    }
    handle(n) {
      if (this.chain === null) {
        let r = Array.from(new Set([...this.injector.get(cm), ...this.injector.get(um, [])]));
        this.chain = r.reduceRight((i, o) => wE(i, o, this.injector), CE);
      }
      if (this.contributeToStability) {
        let r = this.pendingTasks.add();
        return this.chain(n, (i) => this.backend.handle(i)).pipe(yo(r));
      } else return this.chain(n, (r) => this.backend.handle(r));
    }
    static ɵfac = function (r) {
      return new (r || e)(I(_r), I(ee));
    };
    static ɵprov = _({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var IE = /^\)\]\}',?\n/,
  ME = RegExp(`^${du}:`, 'm');
function TE(e) {
  return 'responseURL' in e && e.responseURL
    ? e.responseURL
    : ME.test(e.getAllResponseHeaders())
      ? e.getResponseHeader(du)
      : null;
}
var uu = (() => {
    class e {
      xhrFactory;
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === 'JSONP') throw new y(-2800, !1);
        let r = this.xhrFactory;
        return Vn(null).pipe(
          _o(
            () =>
              new N((o) => {
                let s = r.build();
                if (
                  (s.open(n.method, n.urlWithParams),
                  n.withCredentials && (s.withCredentials = !0),
                  n.headers.forEach((b, g) => s.setRequestHeader(b, g.join(','))),
                  n.headers.has(Fs) || s.setRequestHeader(Fs, sm),
                  !n.headers.has(Ei))
                ) {
                  let b = n.detectContentTypeHeader();
                  b !== null && s.setRequestHeader(Ei, b);
                }
                if ((n.timeout && (s.timeout = n.timeout), n.responseType)) {
                  let b = n.responseType.toLowerCase();
                  s.responseType = b !== 'json' ? b : 'text';
                }
                let a = n.serializeBody(),
                  l = null,
                  c = () => {
                    if (l !== null) return l;
                    let b = s.statusText || 'OK',
                      g = new at(s.getAllResponseHeaders()),
                      K = TE(s) || n.url;
                    return (
                      (l = new Ci({ headers: g, status: s.status, statusText: b, url: K })),
                      l
                    );
                  },
                  u = () => {
                    let { headers: b, status: g, statusText: K, url: qe } = c(),
                      X = null;
                    (g !== bE && (X = typeof s.response > 'u' ? s.responseText : s.response),
                      g === 0 && (g = X ? am : 0));
                    let Ze = g >= 200 && g < 300;
                    if (n.responseType === 'json' && typeof X == 'string') {
                      let lt = X;
                      X = X.replace(IE, '');
                      try {
                        X = X !== '' ? JSON.parse(X) : null;
                      } catch (zt) {
                        ((X = lt), Ze && ((Ze = !1), (X = { error: zt, text: X })));
                      }
                    }
                    Ze
                      ? (o.next(
                          new Dr({
                            body: X,
                            headers: b,
                            status: g,
                            statusText: K,
                            url: qe || void 0,
                          }),
                        ),
                        o.complete())
                      : o.error(
                          new st({
                            error: X,
                            headers: b,
                            status: g,
                            statusText: K,
                            url: qe || void 0,
                          }),
                        );
                  },
                  d = (b) => {
                    let { url: g } = c(),
                      K = new st({
                        error: b,
                        status: s.status || 0,
                        statusText: s.statusText || 'Unknown Error',
                        url: g || void 0,
                      });
                    o.error(K);
                  },
                  p = d;
                n.timeout &&
                  (p = (b) => {
                    let { url: g } = c(),
                      K = new st({
                        error: new DOMException('Request timed out', 'TimeoutError'),
                        status: s.status || 0,
                        statusText: s.statusText || 'Request timeout',
                        url: g || void 0,
                      });
                    o.error(K);
                  });
                let f = !1,
                  m = (b) => {
                    f || (o.next(c()), (f = !0));
                    let g = { type: Ct.DownloadProgress, loaded: b.loaded };
                    (b.lengthComputable && (g.total = b.total),
                      n.responseType === 'text' &&
                        s.responseText &&
                        (g.partialText = s.responseText),
                      o.next(g));
                  },
                  E = (b) => {
                    let g = { type: Ct.UploadProgress, loaded: b.loaded };
                    (b.lengthComputable && (g.total = b.total), o.next(g));
                  };
                return (
                  s.addEventListener('load', u),
                  s.addEventListener('error', d),
                  s.addEventListener('timeout', p),
                  s.addEventListener('abort', d),
                  n.reportProgress &&
                    (s.addEventListener('progress', m),
                    a !== null && s.upload && s.upload.addEventListener('progress', E)),
                  s.send(a),
                  o.next({ type: Ct.Sent }),
                  () => {
                    (s.removeEventListener('error', d),
                      s.removeEventListener('abort', d),
                      s.removeEventListener('load', u),
                      s.removeEventListener('timeout', p),
                      n.reportProgress &&
                        (s.removeEventListener('progress', m),
                        a !== null && s.upload && s.upload.removeEventListener('progress', E)),
                      s.readyState !== s.DONE && s.abort());
                  }
                );
              }),
          ),
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(I(Sn));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  fm = new v(''),
  SE = 'XSRF-TOKEN',
  xE = new v('', { providedIn: 'root', factory: () => SE }),
  AE = 'X-XSRF-TOKEN',
  NE = new v('', { providedIn: 'root', factory: () => AE }),
  wi = class {},
  RE = (() => {
    class e {
      doc;
      cookieName;
      lastCookieString = '';
      lastToken = null;
      parseCount = 0;
      constructor(n, r) {
        ((this.doc = n), (this.cookieName = r));
      }
      getToken() {
        let n = this.doc.cookie || '';
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = vi(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(I(oe), I(xE));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function OE(e, t) {
  let n = e.url.toLowerCase();
  if (
    !h(fm) ||
    e.method === 'GET' ||
    e.method === 'HEAD' ||
    n.startsWith('http://') ||
    n.startsWith('https://')
  )
    return t(e);
  let r = h(wi).getToken(),
    i = h(NE);
  return (r != null && !e.headers.has(i) && (e = e.clone({ headers: e.headers.set(i, r) })), t(e));
}
var fu = (function (e) {
  return (
    (e[(e.Interceptors = 0)] = 'Interceptors'),
    (e[(e.LegacyInterceptors = 1)] = 'LegacyInterceptors'),
    (e[(e.CustomXsrfConfiguration = 2)] = 'CustomXsrfConfiguration'),
    (e[(e.NoXsrfProtection = 3)] = 'NoXsrfProtection'),
    (e[(e.JsonpSupport = 4)] = 'JsonpSupport'),
    (e[(e.RequestsMadeViaParent = 5)] = 'RequestsMadeViaParent'),
    (e[(e.Fetch = 6)] = 'Fetch'),
    e
  );
})(fu || {});
function FE(e, t) {
  return { ɵkind: e, ɵproviders: t };
}
function hu(...e) {
  let t = [
    Ps,
    uu,
    ks,
    { provide: yr, useExisting: ks },
    { provide: _r, useFactory: () => h(lm, { optional: !0 }) ?? h(uu) },
    { provide: cm, useValue: OE, multi: !0 },
    { provide: fm, useValue: !0 },
    { provide: wi, useClass: RE },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return xo(t);
}
function pu() {
  return FE(fu.Fetch, [Ns, { provide: lm, useExisting: Ns }, { provide: _r, useExisting: Ns }]);
}
var hm = 'primary',
  PE = Symbol('RouteTitle'),
  mu = class {
    params;
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function gu(e) {
  return new mu(e);
}
function LE(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var Ls = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return LE(this.route?.snapshot) ?? this.rootInjector;
    }
    constructor(t) {
      ((this.rootInjector = t), (this.children = new Vs(this.rootInjector)));
    }
  },
  Vs = (() => {
    class e {
      rootInjector;
      contexts = new Map();
      constructor(n) {
        this.rootInjector = n;
      }
      onChildOutletCreated(n, r) {
        let i = this.getOrCreateContext(n);
        ((i.outlet = r), this.contexts.set(n, i));
      }
      onChildOutletDestroyed(n) {
        let r = this.getContext(n);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return ((this.contexts = new Map()), n);
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let r = this.getContext(n);
        return (r || ((r = new Ls(this.rootInjector)), this.contexts.set(n, r)), r);
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
      static ɵfac = function (r) {
        return new (r || e)(I(ee));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var js = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(t, n, r, i, o, s, a, l) {
    ((this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = l),
      (this.title = this.dataSubject?.pipe(U((c) => c[PE])) ?? Vn(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = o));
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return ((this._paramMap ??= this.params.pipe(U((t) => gu(t)))), this._paramMap);
  }
  get queryParamMap() {
    return ((this._queryParamMap ??= this.queryParams.pipe(U((t) => gu(t)))), this._queryParamMap);
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
var pm = new v(''),
  yu = (() => {
    class e {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = hm;
      activateEvents = new z();
      deactivateEvents = new z();
      attachEvents = new z();
      detachEvents = new z();
      routerOutletData = Pp(void 0);
      parentContexts = h(Vs);
      location = h(vt);
      changeDetector = h(gr);
      inputBinder = h(jE, { optional: !0 });
      supportsBindingToComponentInputs = !0;
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: r, previousValue: i } = n.name;
          if (r) return;
          (this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
            this.initializeOutletWithName());
        }
      }
      ngOnDestroy() {
        (this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this));
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new y(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new y(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new y(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, r) {
        ((this.activated = n),
          (this._activatedRoute = r),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance));
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          (this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n));
        }
      }
      activateWith(n, r) {
        if (this.isActivated) throw new y(4013, !1);
        this._activatedRoute = n;
        let i = this.location,
          s = n.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          l = new vu(n, a, i.injector, this.routerOutletData);
        ((this.activated = i.createComponent(s, {
          index: i.length,
          injector: l,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = $({
        type: e,
        selectors: [['router-outlet']],
        inputs: { name: 'name', routerOutletData: [1, 'routerOutletData'] },
        outputs: {
          activateEvents: 'activate',
          deactivateEvents: 'deactivate',
          attachEvents: 'attach',
          detachEvents: 'detach',
        },
        exportAs: ['outlet'],
        features: [it],
      });
    }
    return e;
  })(),
  vu = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(t, n, r, i) {
      ((this.route = t), (this.childContexts = n), (this.parent = r), (this.outletData = i));
    }
    get(t, n) {
      return t === js
        ? this.route
        : t === Vs
          ? this.childContexts
          : t === pm
            ? this.outletData
            : this.parent.get(t, n);
    }
  },
  jE = new v('');
var _u;
try {
  _u = typeof Intl < 'u' && Intl.v8BreakIterator;
} catch {
  _u = !1;
}
var We = (() => {
  class e {
    _platformId = h(jt);
    isBrowser = this._platformId ? zp(this._platformId) : typeof document == 'object' && !!document;
    EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
    TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
    BLINK =
      this.isBrowser && !!(window.chrome || _u) && typeof CSS < 'u' && !this.EDGE && !this.TRIDENT;
    WEBKIT =
      this.isBrowser &&
      /AppleWebKit/i.test(navigator.userAgent) &&
      !this.BLINK &&
      !this.EDGE &&
      !this.TRIDENT;
    IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
    ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
    SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
    constructor() {}
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function bu(e) {
  return e instanceof Q ? e.nativeElement : e;
}
var Bs = new WeakMap(),
  mm = (() => {
    class e {
      _appRef;
      _injector = h(De);
      _environmentInjector = h(ee);
      load(n) {
        let r = (this._appRef = this._appRef || this._injector.get(Ut)),
          i = Bs.get(r);
        (i ||
          ((i = { loaders: new Set(), refs: [] }),
          Bs.set(r, i),
          r.onDestroy(() => {
            (Bs.get(r)?.refs.forEach((o) => o.destroy()), Bs.delete(r));
          })),
          i.loaders.has(n) ||
            (i.loaders.add(n),
            i.refs.push(Up(n, { environmentInjector: this._environmentInjector }))));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function Du(e) {
  return Array.isArray(e) ? e : [e];
}
var gm = new Set(),
  xn,
  Us = (() => {
    class e {
      _platform = h(We);
      _nonce = h(ur, { optional: !0 });
      _matchMedia;
      constructor() {
        this._matchMedia =
          this._platform.isBrowser && window.matchMedia ? window.matchMedia.bind(window) : BE;
      }
      matchMedia(n) {
        return (
          (this._platform.WEBKIT || this._platform.BLINK) && VE(n, this._nonce),
          this._matchMedia(n)
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function VE(e, t) {
  if (!gm.has(e))
    try {
      (xn ||
        ((xn = document.createElement('style')),
        t && xn.setAttribute('nonce', t),
        xn.setAttribute('type', 'text/css'),
        document.head.appendChild(xn)),
        xn.sheet && (xn.sheet.insertRule(`@media ${e} {body{ }}`, 0), gm.add(e)));
    } catch (n) {
      console.error(n);
    }
}
function BE(e) {
  return {
    matches: e === 'all' || e === '',
    media: e,
    addListener: () => {},
    removeListener: () => {},
  };
}
var Eu = (() => {
  class e {
    _mediaMatcher = h(Us);
    _zone = h(A);
    _queries = new Map();
    _destroySubject = new j();
    constructor() {}
    ngOnDestroy() {
      (this._destroySubject.next(), this._destroySubject.complete());
    }
    isMatched(n) {
      return vm(Du(n)).some((i) => this._registerQuery(i).mql.matches);
    }
    observe(n) {
      let i = vm(Du(n)).map((s) => this._registerQuery(s).observable),
        o = po(i);
      return (
        (o = tn(o.pipe(vo(1)), o.pipe(Sa(1), wa(0)))),
        o.pipe(
          U((s) => {
            let a = { matches: !1, breakpoints: {} };
            return (
              s.forEach(({ matches: l, query: c }) => {
                ((a.matches = a.matches || l), (a.breakpoints[c] = l));
              }),
              a
            );
          }),
        )
      );
    }
    _registerQuery(n) {
      if (this._queries.has(n)) return this._queries.get(n);
      let r = this._mediaMatcher.matchMedia(n),
        o = {
          observable: new N((s) => {
            let a = (l) => this._zone.run(() => s.next(l));
            return (
              r.addListener(a),
              () => {
                r.removeListener(a);
              }
            );
          }).pipe(
            Bn(r),
            U(({ matches: s }) => ({ query: n, matches: s })),
            Tt(this._destroySubject),
          ),
          mql: r,
        };
      return (this._queries.set(n, o), o);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function vm(e) {
  return e
    .map((t) => t.split(','))
    .reduce((t, n) => t.concat(n))
    .map((t) => t.trim());
}
var UE = (() => {
  class e {
    create(n) {
      return typeof MutationObserver > 'u' ? null : new MutationObserver(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var ym = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = re({ type: e });
    static ɵinj = Y({ providers: [UE] });
  }
  return e;
})();
var Ht = (function (e) {
    return (
      (e[(e.NONE = 0)] = 'NONE'),
      (e[(e.BLACK_ON_WHITE = 1)] = 'BLACK_ON_WHITE'),
      (e[(e.WHITE_ON_BLACK = 2)] = 'WHITE_ON_BLACK'),
      e
    );
  })(Ht || {}),
  _m = 'cdk-high-contrast-black-on-white',
  bm = 'cdk-high-contrast-white-on-black',
  Cu = 'cdk-high-contrast-active',
  wu = (() => {
    class e {
      _platform = h(We);
      _hasCheckedHighContrastMode;
      _document = h(oe);
      _breakpointSubscription;
      constructor() {
        this._breakpointSubscription = h(Eu)
          .observe('(forced-colors: active)')
          .subscribe(() => {
            this._hasCheckedHighContrastMode &&
              ((this._hasCheckedHighContrastMode = !1),
              this._applyBodyHighContrastModeCssClasses());
          });
      }
      getHighContrastMode() {
        if (!this._platform.isBrowser) return Ht.NONE;
        let n = this._document.createElement('div');
        ((n.style.backgroundColor = 'rgb(1,2,3)'),
          (n.style.position = 'absolute'),
          this._document.body.appendChild(n));
        let r = this._document.defaultView || window,
          i = r && r.getComputedStyle ? r.getComputedStyle(n) : null,
          o = ((i && i.backgroundColor) || '').replace(/ /g, '');
        switch ((n.remove(), o)) {
          case 'rgb(0,0,0)':
          case 'rgb(45,50,54)':
          case 'rgb(32,32,32)':
            return Ht.WHITE_ON_BLACK;
          case 'rgb(255,255,255)':
          case 'rgb(255,250,239)':
            return Ht.BLACK_ON_WHITE;
        }
        return Ht.NONE;
      }
      ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
      }
      _applyBodyHighContrastModeCssClasses() {
        if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
          let n = this._document.body.classList;
          (n.remove(Cu, _m, bm), (this._hasCheckedHighContrastMode = !0));
          let r = this.getHighContrastMode();
          r === Ht.BLACK_ON_WHITE ? n.add(Cu, _m) : r === Ht.WHITE_ON_BLACK && n.add(Cu, bm);
        }
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var Iu = {},
  Er = (() => {
    class e {
      _appId = h(cr);
      getId(n) {
        return (
          this._appId !== 'ng' && (n += this._appId),
          Iu.hasOwnProperty(n) || (Iu[n] = 0),
          `${n}${Iu[n]++}`
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var HE = new v('cdk-dir-doc', { providedIn: 'root', factory: $E });
function $E() {
  return h(oe);
}
var zE =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function Dm(e) {
  let t = e?.toLowerCase() || '';
  return t === 'auto' && typeof navigator < 'u' && navigator?.language
    ? zE.test(navigator.language)
      ? 'rtl'
      : 'ltr'
    : t === 'rtl'
      ? 'rtl'
      : 'ltr';
}
var Mu = (() => {
  class e {
    get value() {
      return this.valueSignal();
    }
    valueSignal = ne('ltr');
    change = new z();
    constructor() {
      let n = h(HE, { optional: !0 });
      if (n) {
        let r = n.body ? n.body.dir : null,
          i = n.documentElement ? n.documentElement.dir : null;
        this.valueSignal.set(Dm(r || i || 'ltr'));
      }
    }
    ngOnDestroy() {
      this.change.complete();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var Tu = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = re({ type: e });
    static ɵinj = Y({});
  }
  return e;
})();
function Cr(e) {
  return e != null && `${e}` != 'false';
}
var wr,
  Em = [
    'color',
    'button',
    'checkbox',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week',
  ];
function Su() {
  if (wr) return wr;
  if (typeof document != 'object' || !document) return ((wr = new Set(Em)), wr);
  let e = document.createElement('input');
  return ((wr = new Set(Em.filter((t) => (e.setAttribute('type', t), e.type === t)))), wr);
}
var xu = class {
    _box;
    _destroyed = new j();
    _resizeSubject = new j();
    _resizeObserver;
    _elementObservables = new Map();
    constructor(t) {
      ((this._box = t),
        typeof ResizeObserver < 'u' &&
          (this._resizeObserver = new ResizeObserver((n) => this._resizeSubject.next(n))));
    }
    observe(t) {
      return (
        this._elementObservables.has(t) ||
          this._elementObservables.set(
            t,
            new N((n) => {
              let r = this._resizeSubject.subscribe(n);
              return (
                this._resizeObserver?.observe(t, { box: this._box }),
                () => {
                  (this._resizeObserver?.unobserve(t),
                    r.unsubscribe(),
                    this._elementObservables.delete(t));
                }
              );
            }).pipe(
              Ke((n) => n.some((r) => r.target === t)),
              Ta({ bufferSize: 1, refCount: !0 }),
              Tt(this._destroyed),
            ),
          ),
        this._elementObservables.get(t)
      );
    }
    destroy() {
      (this._destroyed.next(),
        this._destroyed.complete(),
        this._resizeSubject.complete(),
        this._elementObservables.clear());
    }
  },
  Cm = (() => {
    class e {
      _cleanupErrorListener;
      _observers = new Map();
      _ngZone = h(A);
      constructor() {
        typeof ResizeObserver < 'u';
      }
      ngOnDestroy() {
        for (let [, n] of this._observers) n.destroy();
        (this._observers.clear(), this._cleanupErrorListener?.());
      }
      observe(n, r) {
        let i = r?.box || 'content-box';
        return (
          this._observers.has(i) || this._observers.set(i, new xu(i)),
          this._observers.get(i).observe(n)
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var GE = new v('MATERIAL_ANIMATIONS');
var wm = null;
function WE() {
  return h(GE, { optional: !0 })?.animationsDisabled || h(ac, { optional: !0 }) === 'NoopAnimations'
    ? 'di-disabled'
    : ((wm ??= h(Us).matchMedia('(prefers-reduced-motion)').matches),
      wm ? 'reduced-motion' : 'enabled');
}
function Im() {
  return WE() !== 'enabled';
}
var qE = ['notch'],
  ZE = ['matFormFieldNotchedOutline', ''],
  YE = ['*'],
  Mm = ['iconPrefixContainer'],
  Tm = ['textPrefixContainer'],
  Sm = ['iconSuffixContainer'],
  xm = ['textSuffixContainer'],
  QE = ['textField'],
  KE = [
    '*',
    [['mat-label']],
    [
      ['', 'matPrefix', ''],
      ['', 'matIconPrefix', ''],
    ],
    [['', 'matTextPrefix', '']],
    [['', 'matTextSuffix', '']],
    [
      ['', 'matSuffix', ''],
      ['', 'matIconSuffix', ''],
    ],
    [['mat-error'], ['', 'matError', '']],
    [['mat-hint', 3, 'align', 'end']],
    [['mat-hint', 'align', 'end']],
  ],
  XE = [
    '*',
    'mat-label',
    '[matPrefix], [matIconPrefix]',
    '[matTextPrefix]',
    '[matTextSuffix]',
    '[matSuffix], [matIconSuffix]',
    'mat-error, [matError]',
    "mat-hint:not([align='end'])",
    "mat-hint[align='end']",
  ];
function JE(e, t) {
  e & 1 && $e(0, 'span', 21);
}
function eC(e, t) {
  if ((e & 1 && (k(0, 'label', 20), Oe(1, 1), ge(2, JE, 1, 0, 'span', 21), P()), e & 2)) {
    let n = ze(2);
    (Ce('floating', n._shouldLabelFloat())('monitorResize', n._hasOutline())('id', n._labelId),
      _t('for', n._control.disableAutomaticLabeling ? null : n._control.id),
      V(2),
      ve(!n.hideRequiredMarker && n._control.required ? 2 : -1));
  }
}
function tC(e, t) {
  if ((e & 1 && ge(0, eC, 3, 5, 'label', 20), e & 2)) {
    let n = ze();
    ve(n._hasFloatingLabel() ? 0 : -1);
  }
}
function nC(e, t) {
  e & 1 && $e(0, 'div', 7);
}
function rC(e, t) {}
function iC(e, t) {
  if ((e & 1 && Bt(0, rC, 0, 0, 'ng-template', 13), e & 2)) {
    ze(2);
    let n = mr(1);
    Ce('ngTemplateOutlet', n);
  }
}
function oC(e, t) {
  if ((e & 1 && (k(0, 'div', 9), ge(1, iC, 1, 1, null, 13), P()), e & 2)) {
    let n = ze();
    (Ce('matFormFieldNotchedOutlineOpen', n._shouldLabelFloat()),
      V(),
      ve(n._forceDisplayInfixLabel() ? -1 : 1));
  }
}
function sC(e, t) {
  e & 1 && (k(0, 'div', 10, 2), Oe(2, 2), P());
}
function aC(e, t) {
  e & 1 && (k(0, 'div', 11, 3), Oe(2, 3), P());
}
function lC(e, t) {}
function cC(e, t) {
  if ((e & 1 && Bt(0, lC, 0, 0, 'ng-template', 13), e & 2)) {
    ze();
    let n = mr(1);
    Ce('ngTemplateOutlet', n);
  }
}
function uC(e, t) {
  e & 1 && (k(0, 'div', 14, 4), Oe(2, 4), P());
}
function dC(e, t) {
  e & 1 && (k(0, 'div', 15, 5), Oe(2, 5), P());
}
function fC(e, t) {
  e & 1 && $e(0, 'div', 16);
}
function hC(e, t) {
  e & 1 && (k(0, 'div', 18), Oe(1, 6), P());
}
function pC(e, t) {
  if ((e & 1 && (k(0, 'mat-hint', 22), ot(1), P()), e & 2)) {
    let n = ze(2);
    (Ce('id', n._hintLabelId), V(), Tn(n.hintLabel));
  }
}
function mC(e, t) {
  if (
    (e & 1 &&
      (k(0, 'div', 19), ge(1, pC, 2, 2, 'mat-hint', 22), Oe(2, 7), $e(3, 'div', 23), Oe(4, 8), P()),
    e & 2)
  ) {
    let n = ze();
    (V(), ve(n.hintLabel ? 1 : -1));
  }
}
var Ii = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = $({ type: e, selectors: [['mat-label']] });
    }
    return e;
  })(),
  Pm = new v('MatError');
var Au = (() => {
    class e {
      align = 'start';
      id = h(Er).getId('mat-mdc-hint-');
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = $({
        type: e,
        selectors: [['mat-hint']],
        hostAttrs: [1, 'mat-mdc-form-field-hint', 'mat-mdc-form-field-bottom-align'],
        hostVars: 4,
        hostBindings: function (r, i) {
          r & 2 &&
            (hr('id', i.id),
            _t('align', null),
            Fe('mat-mdc-form-field-hint-end', i.align === 'end'));
        },
        inputs: { align: 'align', id: 'id' },
      });
    }
    return e;
  })(),
  Lm = new v('MatPrefix');
var jm = new v('MatSuffix');
var Vm = new v('FloatingLabelParent'),
  Am = (() => {
    class e {
      _elementRef = h(Q);
      get floating() {
        return this._floating;
      }
      set floating(n) {
        ((this._floating = n), this.monitorResize && this._handleResize());
      }
      _floating = !1;
      get monitorResize() {
        return this._monitorResize;
      }
      set monitorResize(n) {
        ((this._monitorResize = n),
          this._monitorResize ? this._subscribeToResize() : this._resizeSubscription.unsubscribe());
      }
      _monitorResize = !1;
      _resizeObserver = h(Cm);
      _ngZone = h(A);
      _parent = h(Vm);
      _resizeSubscription = new Z();
      constructor() {}
      ngOnDestroy() {
        this._resizeSubscription.unsubscribe();
      }
      getWidth() {
        return gC(this._elementRef.nativeElement);
      }
      get element() {
        return this._elementRef.nativeElement;
      }
      _handleResize() {
        setTimeout(() => this._parent._handleLabelResized());
      }
      _subscribeToResize() {
        (this._resizeSubscription.unsubscribe(),
          this._ngZone.runOutsideAngular(() => {
            this._resizeSubscription = this._resizeObserver
              .observe(this._elementRef.nativeElement, { box: 'border-box' })
              .subscribe(() => this._handleResize());
          }));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = $({
        type: e,
        selectors: [['label', 'matFormFieldFloatingLabel', '']],
        hostAttrs: [1, 'mdc-floating-label', 'mat-mdc-floating-label'],
        hostVars: 2,
        hostBindings: function (r, i) {
          r & 2 && Fe('mdc-floating-label--float-above', i.floating);
        },
        inputs: { floating: 'floating', monitorResize: 'monitorResize' },
      });
    }
    return e;
  })();
function gC(e) {
  let t = e;
  if (t.offsetParent !== null) return t.scrollWidth;
  let n = t.cloneNode(!0);
  (n.style.setProperty('position', 'absolute'),
    n.style.setProperty('transform', 'translate(-9999px, -9999px)'),
    document.documentElement.appendChild(n));
  let r = n.scrollWidth;
  return (n.remove(), r);
}
var Nm = 'mdc-line-ripple--active',
  Hs = 'mdc-line-ripple--deactivating',
  Rm = (() => {
    class e {
      _elementRef = h(Q);
      _cleanupTransitionEnd;
      constructor() {
        let n = h(A),
          r = h(Vt);
        n.runOutsideAngular(() => {
          this._cleanupTransitionEnd = r.listen(
            this._elementRef.nativeElement,
            'transitionend',
            this._handleTransitionEnd,
          );
        });
      }
      activate() {
        let n = this._elementRef.nativeElement.classList;
        (n.remove(Hs), n.add(Nm));
      }
      deactivate() {
        this._elementRef.nativeElement.classList.add(Hs);
      }
      _handleTransitionEnd = (n) => {
        let r = this._elementRef.nativeElement.classList,
          i = r.contains(Hs);
        n.propertyName === 'opacity' && i && r.remove(Nm, Hs);
      };
      ngOnDestroy() {
        this._cleanupTransitionEnd();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = $({
        type: e,
        selectors: [['div', 'matFormFieldLineRipple', '']],
        hostAttrs: [1, 'mdc-line-ripple'],
      });
    }
    return e;
  })(),
  Om = (() => {
    class e {
      _elementRef = h(Q);
      _ngZone = h(A);
      open = !1;
      _notch;
      ngAfterViewInit() {
        let n = this._elementRef.nativeElement,
          r = n.querySelector('.mdc-floating-label');
        r
          ? (n.classList.add('mdc-notched-outline--upgraded'),
            typeof requestAnimationFrame == 'function' &&
              ((r.style.transitionDuration = '0s'),
              this._ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => (r.style.transitionDuration = ''));
              })))
          : n.classList.add('mdc-notched-outline--no-label');
      }
      _setNotchWidth(n) {
        let r = this._notch.nativeElement;
        !this.open || !n
          ? (r.style.width = '')
          : (r.style.width = `calc(${n}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`);
      }
      _setMaxWidth(n) {
        this._notch.nativeElement.style.setProperty(
          '--mat-form-field-notch-max-width',
          `calc(100% - ${n}px)`,
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵcmp = yt({
        type: e,
        selectors: [['div', 'matFormFieldNotchedOutline', '']],
        viewQuery: function (r, i) {
          if ((r & 1 && Ge(qE, 5), r & 2)) {
            let o;
            fe((o = he())) && (i._notch = o.first);
          }
        },
        hostAttrs: [1, 'mdc-notched-outline'],
        hostVars: 2,
        hostBindings: function (r, i) {
          r & 2 && Fe('mdc-notched-outline--notched', i.open);
        },
        inputs: { open: [0, 'matFormFieldNotchedOutlineOpen', 'open'] },
        attrs: ZE,
        ngContentSelectors: YE,
        decls: 5,
        vars: 0,
        consts: [
          ['notch', ''],
          [1, 'mat-mdc-notch-piece', 'mdc-notched-outline__leading'],
          [1, 'mat-mdc-notch-piece', 'mdc-notched-outline__notch'],
          [1, 'mat-mdc-notch-piece', 'mdc-notched-outline__trailing'],
        ],
        template: function (r, i) {
          r & 1 && (Ds(), ai(0, 'div', 1), oi(1, 'div', 2, 0), Oe(3), si(), ai(4, 'div', 3));
        },
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return e;
  })(),
  $s = (() => {
    class e {
      value;
      stateChanges;
      id;
      placeholder;
      ngControl;
      focused;
      empty;
      shouldLabelFloat;
      required;
      disabled;
      errorState;
      controlType;
      autofilled;
      userAriaDescribedBy;
      disableAutomaticLabeling;
      describedByIds;
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = $({ type: e });
    }
    return e;
  })();
var zs = new v('MatFormField'),
  Bm = new v('MAT_FORM_FIELD_DEFAULT_OPTIONS'),
  Fm = 'fill',
  vC = 'auto',
  km = 'fixed',
  yC = 'translateY(-50%)',
  Mi = (() => {
    class e {
      _elementRef = h(Q);
      _changeDetectorRef = h(gr);
      _platform = h(We);
      _idGenerator = h(Er);
      _ngZone = h(A);
      _defaults = h(Bm, { optional: !0 });
      _currentDirection;
      _textField;
      _iconPrefixContainer;
      _textPrefixContainer;
      _iconSuffixContainer;
      _textSuffixContainer;
      _floatingLabel;
      _notchedOutline;
      _lineRipple;
      _iconPrefixContainerSignal = hi('iconPrefixContainer');
      _textPrefixContainerSignal = hi('textPrefixContainer');
      _iconSuffixContainerSignal = hi('iconSuffixContainer');
      _textSuffixContainerSignal = hi('textSuffixContainer');
      _prefixSuffixContainers = ye(() =>
        [
          this._iconPrefixContainerSignal(),
          this._textPrefixContainerSignal(),
          this._iconSuffixContainerSignal(),
          this._textSuffixContainerSignal(),
        ]
          .map((n) => n?.nativeElement)
          .filter((n) => n !== void 0),
      );
      _formFieldControl;
      _prefixChildren;
      _suffixChildren;
      _errorChildren;
      _hintChildren;
      _labelChild = Lp(Ii);
      get hideRequiredMarker() {
        return this._hideRequiredMarker;
      }
      set hideRequiredMarker(n) {
        this._hideRequiredMarker = Cr(n);
      }
      _hideRequiredMarker = !1;
      color = 'primary';
      get floatLabel() {
        return this._floatLabel || this._defaults?.floatLabel || vC;
      }
      set floatLabel(n) {
        n !== this._floatLabel && ((this._floatLabel = n), this._changeDetectorRef.markForCheck());
      }
      _floatLabel;
      get appearance() {
        return this._appearanceSignal();
      }
      set appearance(n) {
        let r = n || this._defaults?.appearance || Fm;
        this._appearanceSignal.set(r);
      }
      _appearanceSignal = ne(Fm);
      get subscriptSizing() {
        return this._subscriptSizing || this._defaults?.subscriptSizing || km;
      }
      set subscriptSizing(n) {
        this._subscriptSizing = n || this._defaults?.subscriptSizing || km;
      }
      _subscriptSizing = null;
      get hintLabel() {
        return this._hintLabel;
      }
      set hintLabel(n) {
        ((this._hintLabel = n), this._processHints());
      }
      _hintLabel = '';
      _hasIconPrefix = !1;
      _hasTextPrefix = !1;
      _hasIconSuffix = !1;
      _hasTextSuffix = !1;
      _labelId = this._idGenerator.getId('mat-mdc-form-field-label-');
      _hintLabelId = this._idGenerator.getId('mat-mdc-hint-');
      _describedByIds;
      get _control() {
        return this._explicitFormFieldControl || this._formFieldControl;
      }
      set _control(n) {
        this._explicitFormFieldControl = n;
      }
      _destroyed = new j();
      _isFocused = null;
      _explicitFormFieldControl;
      _previousControl = null;
      _previousControlValidatorFn = null;
      _stateChanges;
      _valueChanges;
      _describedByChanges;
      _outlineLabelOffsetResizeObserver = null;
      _animationsDisabled = Im();
      constructor() {
        let n = this._defaults,
          r = h(Mu);
        (n &&
          (n.appearance && (this.appearance = n.appearance),
          (this._hideRequiredMarker = !!n?.hideRequiredMarker),
          n.color && (this.color = n.color)),
          Dt(() => (this._currentDirection = r.valueSignal())),
          this._syncOutlineLabelOffset());
      }
      ngAfterViewInit() {
        (this._updateFocusState(),
          this._animationsDisabled ||
            this._ngZone.runOutsideAngular(() => {
              setTimeout(() => {
                this._elementRef.nativeElement.classList.add('mat-form-field-animations-enabled');
              }, 300);
            }),
          this._changeDetectorRef.detectChanges());
      }
      ngAfterContentInit() {
        (this._assertFormFieldControl(),
          this._initializeSubscript(),
          this._initializePrefixAndSuffix());
      }
      ngAfterContentChecked() {
        (this._assertFormFieldControl(),
          this._control !== this._previousControl &&
            (this._initializeControl(this._previousControl),
            this._control.ngControl &&
              this._control.ngControl.control &&
              (this._previousControlValidatorFn = this._control.ngControl.control.validator),
            (this._previousControl = this._control)),
          this._control.ngControl &&
            this._control.ngControl.control &&
            this._control.ngControl.control.validator !== this._previousControlValidatorFn &&
            this._changeDetectorRef.markForCheck());
      }
      ngOnDestroy() {
        (this._outlineLabelOffsetResizeObserver?.disconnect(),
          this._stateChanges?.unsubscribe(),
          this._valueChanges?.unsubscribe(),
          this._describedByChanges?.unsubscribe(),
          this._destroyed.next(),
          this._destroyed.complete());
      }
      getLabelId = ye(() => (this._hasFloatingLabel() ? this._labelId : null));
      getConnectedOverlayOrigin() {
        return this._textField || this._elementRef;
      }
      _animateAndLockLabel() {
        this._hasFloatingLabel() && (this.floatLabel = 'always');
      }
      _initializeControl(n) {
        let r = this._control,
          i = 'mat-mdc-form-field-type-';
        (n && this._elementRef.nativeElement.classList.remove(i + n.controlType),
          r.controlType && this._elementRef.nativeElement.classList.add(i + r.controlType),
          this._stateChanges?.unsubscribe(),
          (this._stateChanges = r.stateChanges.subscribe(() => {
            (this._updateFocusState(), this._changeDetectorRef.markForCheck());
          })),
          this._describedByChanges?.unsubscribe(),
          (this._describedByChanges = r.stateChanges
            .pipe(
              Bn([void 0, void 0]),
              U(() => [r.errorState, r.userAriaDescribedBy]),
              Ia(),
              Ke(([[o, s], [a, l]]) => o !== a || s !== l),
            )
            .subscribe(() => this._syncDescribedByIds())),
          this._valueChanges?.unsubscribe(),
          r.ngControl &&
            r.ngControl.valueChanges &&
            (this._valueChanges = r.ngControl.valueChanges
              .pipe(Tt(this._destroyed))
              .subscribe(() => this._changeDetectorRef.markForCheck())));
      }
      _checkPrefixAndSuffixTypes() {
        ((this._hasIconPrefix = !!this._prefixChildren.find((n) => !n._isText)),
          (this._hasTextPrefix = !!this._prefixChildren.find((n) => n._isText)),
          (this._hasIconSuffix = !!this._suffixChildren.find((n) => !n._isText)),
          (this._hasTextSuffix = !!this._suffixChildren.find((n) => n._isText)));
      }
      _initializePrefixAndSuffix() {
        (this._checkPrefixAndSuffixTypes(),
          Ca(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(() => {
            (this._checkPrefixAndSuffixTypes(), this._changeDetectorRef.markForCheck());
          }));
      }
      _initializeSubscript() {
        (this._hintChildren.changes.subscribe(() => {
          (this._processHints(), this._changeDetectorRef.markForCheck());
        }),
          this._errorChildren.changes.subscribe(() => {
            (this._syncDescribedByIds(), this._changeDetectorRef.markForCheck());
          }),
          this._validateHints(),
          this._syncDescribedByIds());
      }
      _assertFormFieldControl() {
        this._control;
      }
      _updateFocusState() {
        let n = this._control.focused;
        (n && !this._isFocused
          ? ((this._isFocused = !0), this._lineRipple?.activate())
          : !n &&
            (this._isFocused || this._isFocused === null) &&
            ((this._isFocused = !1), this._lineRipple?.deactivate()),
          this._elementRef.nativeElement.classList.toggle('mat-focused', n),
          this._textField?.nativeElement.classList.toggle('mdc-text-field--focused', n));
      }
      _syncOutlineLabelOffset() {
        Bp({
          earlyRead: () => {
            if (this._appearanceSignal() !== 'outline')
              return (this._outlineLabelOffsetResizeObserver?.disconnect(), null);
            if (globalThis.ResizeObserver) {
              this._outlineLabelOffsetResizeObserver ||= new globalThis.ResizeObserver(() => {
                this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset());
              });
              for (let n of this._prefixSuffixContainers())
                this._outlineLabelOffsetResizeObserver.observe(n, { box: 'border-box' });
            }
            return this._getOutlinedLabelOffset();
          },
          write: (n) => this._writeOutlinedLabelStyles(n()),
        });
      }
      _shouldAlwaysFloat() {
        return this.floatLabel === 'always';
      }
      _hasOutline() {
        return this.appearance === 'outline';
      }
      _forceDisplayInfixLabel() {
        return (
          !this._platform.isBrowser && this._prefixChildren.length && !this._shouldLabelFloat()
        );
      }
      _hasFloatingLabel = ye(() => !!this._labelChild());
      _shouldLabelFloat() {
        return this._hasFloatingLabel()
          ? this._control.shouldLabelFloat || this._shouldAlwaysFloat()
          : !1;
      }
      _shouldForward(n) {
        let r = this._control ? this._control.ngControl : null;
        return r && r[n];
      }
      _getSubscriptMessageType() {
        return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState
          ? 'error'
          : 'hint';
      }
      _handleLabelResized() {
        this._refreshOutlineNotchWidth();
      }
      _refreshOutlineNotchWidth() {
        !this._hasOutline() || !this._floatingLabel || !this._shouldLabelFloat()
          ? this._notchedOutline?._setNotchWidth(0)
          : this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth());
      }
      _processHints() {
        (this._validateHints(), this._syncDescribedByIds());
      }
      _validateHints() {
        this._hintChildren;
      }
      _syncDescribedByIds() {
        if (this._control) {
          let n = [];
          if (
            (this._control.userAriaDescribedBy &&
              typeof this._control.userAriaDescribedBy == 'string' &&
              n.push(...this._control.userAriaDescribedBy.split(' ')),
            this._getSubscriptMessageType() === 'hint')
          ) {
            let o = this._hintChildren ? this._hintChildren.find((a) => a.align === 'start') : null,
              s = this._hintChildren ? this._hintChildren.find((a) => a.align === 'end') : null;
            (o ? n.push(o.id) : this._hintLabel && n.push(this._hintLabelId), s && n.push(s.id));
          } else this._errorChildren && n.push(...this._errorChildren.map((o) => o.id));
          let r = this._control.describedByIds,
            i;
          if (r) {
            let o = this._describedByIds || n;
            i = n.concat(r.filter((s) => s && !o.includes(s)));
          } else i = n;
          (this._control.setDescribedByIds(i), (this._describedByIds = n));
        }
      }
      _getOutlinedLabelOffset() {
        if (!this._hasOutline() || !this._floatingLabel) return null;
        if (!this._iconPrefixContainer && !this._textPrefixContainer) return ['', null];
        if (!this._isAttachedToDom()) return null;
        let n = this._iconPrefixContainer?.nativeElement,
          r = this._textPrefixContainer?.nativeElement,
          i = this._iconSuffixContainer?.nativeElement,
          o = this._textSuffixContainer?.nativeElement,
          s = n?.getBoundingClientRect().width ?? 0,
          a = r?.getBoundingClientRect().width ?? 0,
          l = i?.getBoundingClientRect().width ?? 0,
          c = o?.getBoundingClientRect().width ?? 0,
          u = this._currentDirection === 'rtl' ? '-1' : '1',
          d = `${s + a}px`,
          f = `calc(${u} * (${d} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,
          m = `var(--mat-mdc-form-field-label-transform, ${yC} translateX(${f}))`,
          E = s + a + l + c;
        return [m, E];
      }
      _writeOutlinedLabelStyles(n) {
        if (n !== null) {
          let [r, i] = n;
          (this._floatingLabel && (this._floatingLabel.element.style.transform = r),
            i !== null && this._notchedOutline?._setMaxWidth(i));
        }
      }
      _isAttachedToDom() {
        let n = this._elementRef.nativeElement;
        if (n.getRootNode) {
          let r = n.getRootNode();
          return r && r !== n;
        }
        return document.documentElement.contains(n);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵcmp = yt({
        type: e,
        selectors: [['mat-form-field']],
        contentQueries: function (r, i, o) {
          if (
            (r & 1 &&
              (Hc(o, i._labelChild, Ii, 5),
              Mn(o, $s, 5),
              Mn(o, Lm, 5),
              Mn(o, jm, 5),
              Mn(o, Pm, 5),
              Mn(o, Au, 5)),
            r & 2)
          ) {
            Es();
            let s;
            (fe((s = he())) && (i._formFieldControl = s.first),
              fe((s = he())) && (i._prefixChildren = s),
              fe((s = he())) && (i._suffixChildren = s),
              fe((s = he())) && (i._errorChildren = s),
              fe((s = he())) && (i._hintChildren = s));
          }
        },
        viewQuery: function (r, i) {
          if (
            (r & 1 &&
              (pr(i._iconPrefixContainerSignal, Mm, 5),
              pr(i._textPrefixContainerSignal, Tm, 5),
              pr(i._iconSuffixContainerSignal, Sm, 5),
              pr(i._textSuffixContainerSignal, xm, 5),
              Ge(QE, 5),
              Ge(Mm, 5),
              Ge(Tm, 5),
              Ge(Sm, 5),
              Ge(xm, 5),
              Ge(Am, 5),
              Ge(Om, 5),
              Ge(Rm, 5)),
            r & 2)
          ) {
            Es(4);
            let o;
            (fe((o = he())) && (i._textField = o.first),
              fe((o = he())) && (i._iconPrefixContainer = o.first),
              fe((o = he())) && (i._textPrefixContainer = o.first),
              fe((o = he())) && (i._iconSuffixContainer = o.first),
              fe((o = he())) && (i._textSuffixContainer = o.first),
              fe((o = he())) && (i._floatingLabel = o.first),
              fe((o = he())) && (i._notchedOutline = o.first),
              fe((o = he())) && (i._lineRipple = o.first));
          }
        },
        hostAttrs: [1, 'mat-mdc-form-field'],
        hostVars: 38,
        hostBindings: function (r, i) {
          r & 2 &&
            Fe('mat-mdc-form-field-label-always-float', i._shouldAlwaysFloat())(
              'mat-mdc-form-field-has-icon-prefix',
              i._hasIconPrefix,
            )('mat-mdc-form-field-has-icon-suffix', i._hasIconSuffix)(
              'mat-form-field-invalid',
              i._control.errorState,
            )('mat-form-field-disabled', i._control.disabled)(
              'mat-form-field-autofilled',
              i._control.autofilled,
            )('mat-form-field-appearance-fill', i.appearance == 'fill')(
              'mat-form-field-appearance-outline',
              i.appearance == 'outline',
            )('mat-form-field-hide-placeholder', i._hasFloatingLabel() && !i._shouldLabelFloat())(
              'mat-primary',
              i.color !== 'accent' && i.color !== 'warn',
            )('mat-accent', i.color === 'accent')('mat-warn', i.color === 'warn')(
              'ng-untouched',
              i._shouldForward('untouched'),
            )('ng-touched', i._shouldForward('touched'))(
              'ng-pristine',
              i._shouldForward('pristine'),
            )('ng-dirty', i._shouldForward('dirty'))('ng-valid', i._shouldForward('valid'))(
              'ng-invalid',
              i._shouldForward('invalid'),
            )('ng-pending', i._shouldForward('pending'));
        },
        inputs: {
          hideRequiredMarker: 'hideRequiredMarker',
          color: 'color',
          floatLabel: 'floatLabel',
          appearance: 'appearance',
          subscriptSizing: 'subscriptSizing',
          hintLabel: 'hintLabel',
        },
        exportAs: ['matFormField'],
        features: [
          bt([
            { provide: zs, useExisting: e },
            { provide: Vm, useExisting: e },
          ]),
        ],
        ngContentSelectors: XE,
        decls: 18,
        vars: 21,
        consts: [
          ['labelTemplate', ''],
          ['textField', ''],
          ['iconPrefixContainer', ''],
          ['textPrefixContainer', ''],
          ['textSuffixContainer', ''],
          ['iconSuffixContainer', ''],
          [1, 'mat-mdc-text-field-wrapper', 'mdc-text-field', 3, 'click'],
          [1, 'mat-mdc-form-field-focus-overlay'],
          [1, 'mat-mdc-form-field-flex'],
          ['matFormFieldNotchedOutline', '', 3, 'matFormFieldNotchedOutlineOpen'],
          [1, 'mat-mdc-form-field-icon-prefix'],
          [1, 'mat-mdc-form-field-text-prefix'],
          [1, 'mat-mdc-form-field-infix'],
          [3, 'ngTemplateOutlet'],
          [1, 'mat-mdc-form-field-text-suffix'],
          [1, 'mat-mdc-form-field-icon-suffix'],
          ['matFormFieldLineRipple', ''],
          [
            'aria-atomic',
            'true',
            'aria-live',
            'polite',
            1,
            'mat-mdc-form-field-subscript-wrapper',
            'mat-mdc-form-field-bottom-align',
          ],
          [1, 'mat-mdc-form-field-error-wrapper'],
          [1, 'mat-mdc-form-field-hint-wrapper'],
          ['matFormFieldFloatingLabel', '', 3, 'floating', 'monitorResize', 'id'],
          [
            'aria-hidden',
            'true',
            1,
            'mat-mdc-form-field-required-marker',
            'mdc-floating-label--required',
          ],
          [3, 'id'],
          [1, 'mat-mdc-form-field-hint-spacer'],
        ],
        template: function (r, i) {
          if (r & 1) {
            let o = li();
            (Ds(KE),
              Bt(0, tC, 1, 1, 'ng-template', null, 0, di),
              k(2, 'div', 6, 1),
              Te('click', function (a) {
                return (gn(o), vn(i._control.onContainerClick(a)));
              }),
              ge(4, nC, 1, 0, 'div', 7),
              k(5, 'div', 8),
              ge(6, oC, 2, 2, 'div', 9),
              ge(7, sC, 3, 0, 'div', 10),
              ge(8, aC, 3, 0, 'div', 11),
              k(9, 'div', 12),
              ge(10, cC, 1, 1, null, 13),
              Oe(11),
              P(),
              ge(12, uC, 3, 0, 'div', 14),
              ge(13, dC, 3, 0, 'div', 15),
              P(),
              ge(14, fC, 1, 0, 'div', 16),
              P(),
              k(15, 'div', 17),
              ge(16, hC, 2, 0, 'div', 18)(17, mC, 5, 1, 'div', 19),
              P());
          }
          if (r & 2) {
            let o;
            (V(2),
              Fe('mdc-text-field--filled', !i._hasOutline())(
                'mdc-text-field--outlined',
                i._hasOutline(),
              )('mdc-text-field--no-label', !i._hasFloatingLabel())(
                'mdc-text-field--disabled',
                i._control.disabled,
              )('mdc-text-field--invalid', i._control.errorState),
              V(2),
              ve(!i._hasOutline() && !i._control.disabled ? 4 : -1),
              V(2),
              ve(i._hasOutline() ? 6 : -1),
              V(),
              ve(i._hasIconPrefix ? 7 : -1),
              V(),
              ve(i._hasTextPrefix ? 8 : -1),
              V(2),
              ve(!i._hasOutline() || i._forceDisplayInfixLabel() ? 10 : -1),
              V(2),
              ve(i._hasTextSuffix ? 12 : -1),
              V(),
              ve(i._hasIconSuffix ? 13 : -1),
              V(),
              ve(i._hasOutline() ? -1 : 14),
              V(),
              Fe('mat-mdc-form-field-subscript-dynamic-size', i.subscriptSizing === 'dynamic'));
            let s = i._getSubscriptMessageType();
            (V(), ve((o = s) === 'error' ? 16 : o === 'hint' ? 17 : -1));
          }
        },
        dependencies: [Am, Om, Qc, Rm, Au],
        styles: [
          `.mdc-text-field{display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-text-field__input{width:100%;min-width:0;border:none;border-radius:0;background:none;padding:0;-moz-appearance:none;-webkit-appearance:none;height:28px}.mdc-text-field__input::-webkit-calendar-picker-indicator,.mdc-text-field__input::-webkit-search-cancel-button{display:none}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}.mdc-text-field__input::placeholder{opacity:0}.mdc-text-field__input::-moz-placeholder{opacity:0}.mdc-text-field__input::-webkit-input-placeholder{opacity:0}.mdc-text-field__input:-ms-input-placeholder{opacity:0}.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{opacity:1}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder{opacity:0}.mdc-text-field--outlined .mdc-text-field__input,.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:rgba(0,0,0,0)}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-filled-caret-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error))}.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}@media(forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}}.mdc-text-field--filled{height:56px;border-bottom-right-radius:0;border-bottom-left-radius:0;border-top-left-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));border-top-right-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled{background-color:var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent))}.mdc-text-field--outlined{height:56px;overflow:visible;padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px)}[dir=rtl] .mdc-text-field--outlined{padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}.mdc-floating-label{position:absolute;left:0;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform}[dir=rtl] .mdc-floating-label{right:0;left:auto;transform-origin:right top;text-align:right}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:auto}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label{left:auto;right:4px}.mdc-text-field--filled .mdc-floating-label{left:16px;right:auto}[dir=rtl] .mdc-text-field--filled .mdc-floating-label{left:auto;right:16px}.mdc-text-field--disabled .mdc-floating-label{cursor:default}@media(forced-colors: active){.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--filled .mdc-floating-label{font-family:var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined .mdc-floating-label{font-family:var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-floating-label--float-above{cursor:auto;transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1);font-size:.75rem}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:133.3333333333%}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:1px;margin-right:0;content:"*"}[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:0;margin-right:1px}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mat-mdc-notch-piece{box-sizing:border-box;height:100%;pointer-events:none;border-top:1px solid;border-bottom:1px solid}.mdc-text-field--focused .mat-mdc-notch-piece{border-width:2px}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));border-width:var(--mat-form-field-outlined-outline-width, 1px)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary))}.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece{border-width:var(--mat-form-field-outlined-focus-outline-width, 2px)}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid;border-bottom-left-radius:0;border-top-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__trailing{flex-grow:1;border-left:none;border-right:1px solid;border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__notch{flex:0 0 auto;width:auto}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:min(var(--mat-form-field-notch-max-width, 100%),calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{max-width:min(100%,calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{z-index:1;border-bottom-width:var(--mat-form-field-filled-active-indicator-height, 1px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container))}.mdc-line-ripple::after{transform:scaleX(0);opacity:0;z-index:2}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-width:var(--mat-form-field-filled-focus-active-indicator-height, 2px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error))}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-text-field--disabled{pointer-events:none}.mat-mdc-form-field-textarea-control{vertical-align:middle;resize:vertical;box-sizing:border-box;height:auto;margin:0;padding:0;border:none;overflow:auto}.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font:inherit;letter-spacing:inherit;text-decoration:inherit;text-transform:inherit;border:none}.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;line-height:normal;pointer-events:all;will-change:auto}.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label{cursor:inherit}.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control{height:auto}.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color]{height:23px}.mat-mdc-text-field-wrapper{height:auto;flex:auto;will-change:auto}.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-left:0;--mat-mdc-form-field-label-offset-x: -16px}.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-right:0}[dir=rtl] .mat-mdc-text-field-wrapper{padding-left:16px;padding-right:16px}[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-left:0}[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-right:0}.mat-form-field-disabled .mdc-text-field__input::placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label{left:auto;right:auto}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input{display:inline-block}.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch{padding-top:0}.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:1px solid rgba(0,0,0,0)}[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:none;border-right:1px solid rgba(0,0,0,0)}.mat-mdc-form-field-infix{min-height:var(--mat-form-field-container-height, 56px);padding-top:var(--mat-form-field-filled-with-label-container-padding-top, 24px);padding-bottom:var(--mat-form-field-filled-with-label-container-padding-bottom, 8px)}.mdc-text-field--outlined .mat-mdc-form-field-infix,.mdc-text-field--no-label .mat-mdc-form-field-infix{padding-top:var(--mat-form-field-container-vertical-padding, 16px);padding-bottom:var(--mat-form-field-container-vertical-padding, 16px)}.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label{top:calc(var(--mat-form-field-container-height, 56px)/2)}.mdc-text-field--filled .mat-mdc-floating-label{display:var(--mat-form-field-filled-label-display, block)}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{--mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1)) scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));transform:var(--mat-mdc-form-field-label-transform)}@keyframes _mat-form-field-subscript-animation{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.mat-mdc-form-field-subscript-wrapper{box-sizing:border-box;width:100%;position:relative}.mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-error-wrapper{position:absolute;top:0;left:0;right:0;padding:0 16px;opacity:1;transform:translateY(0);animation:_mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper{position:static}.mat-mdc-form-field-bottom-align::before{content:"";display:inline-block;height:16px}.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before{content:unset}.mat-mdc-form-field-hint-end{order:1}.mat-mdc-form-field-hint-wrapper{display:flex}.mat-mdc-form-field-hint-spacer{flex:1 0 1em}.mat-mdc-form-field-error{display:block;color:var(--mat-form-field-error-text-color, var(--mat-sys-error))}.mat-mdc-form-field-subscript-wrapper,.mat-mdc-form-field-bottom-align::before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));line-height:var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));font-size:var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));letter-spacing:var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));font-weight:var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight))}.mat-mdc-form-field-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;opacity:0;pointer-events:none;background-color:var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface))}.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-focus-state-layer-opacity, 0)}select.mat-mdc-form-field-input-control{-moz-appearance:none;-webkit-appearance:none;background-color:rgba(0,0,0,0);display:inline-flex;box-sizing:border-box}select.mat-mdc-form-field-input-control:not(:disabled){cursor:pointer}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option{color:var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10))}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled{color:var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;position:absolute;right:0;top:50%;margin-top:-2.5px;pointer-events:none;color:var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant))}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{right:auto;left:0}.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after{color:var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary))}.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after{color:var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:15px}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:0;padding-left:15px}@media(forced-colors: active){.mat-form-field-appearance-fill .mat-mdc-text-field-wrapper{outline:solid 1px}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper{outline-color:GrayText}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper{outline:dashed 3px}}@media(forced-colors: active){.mat-mdc-form-field.mat-focused .mdc-notched-outline{border:dashed 3px}}.mat-mdc-form-field-input-control[type=date],.mat-mdc-form-field-input-control[type=datetime],.mat-mdc-form-field-input-control[type=datetime-local],.mat-mdc-form-field-input-control[type=month],.mat-mdc-form-field-input-control[type=week],.mat-mdc-form-field-input-control[type=time]{line-height:1}.mat-mdc-form-field-input-control::-webkit-datetime-edit{line-height:1;padding:0;margin-bottom:-2px}.mat-mdc-form-field{--mat-mdc-form-field-floating-label-scale: 0.75;display:inline-flex;flex-direction:column;min-width:0;text-align:left;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));line-height:var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));font-size:var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));letter-spacing:var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));font-weight:var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above{font-size:calc(var(--mat-form-field-outlined-label-text-populated-size)*var(--mat-mdc-form-field-floating-label-scale))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:var(--mat-form-field-outlined-label-text-populated-size)}[dir=rtl] .mat-mdc-form-field{text-align:right}.mat-mdc-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-mdc-text-field-wrapper{width:100%;z-index:0}.mat-mdc-form-field-icon-prefix,.mat-mdc-form-field-icon-suffix{align-self:center;line-height:0;pointer-events:auto;position:relative;z-index:1}.mat-mdc-form-field-icon-prefix>.mat-icon,.mat-mdc-form-field-icon-suffix>.mat-icon{padding:0 12px;box-sizing:content-box}.mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-invalid .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error))}.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container))}.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error))}.mat-mdc-form-field-icon-prefix,[dir=rtl] .mat-mdc-form-field-icon-suffix{padding:0 4px 0 0}.mat-mdc-form-field-icon-suffix,[dir=rtl] .mat-mdc-form-field-icon-prefix{padding:0 0 0 4px}.mat-mdc-form-field-subscript-wrapper .mat-icon,.mat-mdc-form-field label .mat-icon{width:1em;height:1em;font-size:inherit}.mat-mdc-form-field-infix{flex:auto;min-width:0;width:180px;position:relative;box-sizing:border-box}.mat-mdc-form-field-infix:has(textarea[cols]){width:auto}.mat-mdc-form-field .mdc-notched-outline__notch{margin-left:-1px;-webkit-clip-path:inset(-9em -999em -9em 1px);clip-path:inset(-9em -999em -9em 1px)}[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch{margin-left:0;margin-right:-1px;-webkit-clip-path:inset(-9em 1px -9em -999em);clip-path:inset(-9em 1px -9em -999em)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label{transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input{transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper{animation-duration:300ms}.mdc-notched-outline .mdc-floating-label{max-width:calc(100% + 1px)}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(133.3333333333% + 1px)}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return e;
  })();
var Ir = (() => {
  class e {
    constructor() {
      h(wu)._applyBodyHighContrastModeCssClasses();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = re({ type: e });
    static ɵinj = Y({ imports: [Tu, Tu] });
  }
  return e;
})();
var Mr = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = re({ type: e });
    static ɵinj = Y({ imports: [Ir, ym, Mi, Ir] });
  }
  return e;
})();
var bC = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵcmp = yt({
        type: e,
        selectors: [['ng-component']],
        hostAttrs: ['cdk-text-field-style-loader', ''],
        decls: 0,
        vars: 0,
        template: function (r, i) {},
        styles: [
          `textarea.cdk-textarea-autosize{resize:none}textarea.cdk-textarea-autosize-measuring{padding:2px 0 !important;box-sizing:content-box !important;height:auto !important;overflow:hidden !important}textarea.cdk-textarea-autosize-measuring-firefox{padding:2px 0 !important;box-sizing:content-box !important;height:0 !important}@keyframes cdk-text-field-autofill-start{/*!*/}@keyframes cdk-text-field-autofill-end{/*!*/}.cdk-text-field-autofill-monitored:-webkit-autofill{animation:cdk-text-field-autofill-start 0s 1ms}.cdk-text-field-autofill-monitored:not(:-webkit-autofill){animation:cdk-text-field-autofill-end 0s 1ms}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return e;
  })(),
  DC = { passive: !0 },
  Um = (() => {
    class e {
      _platform = h(We);
      _ngZone = h(A);
      _renderer = h(mt).createRenderer(null, null);
      _styleLoader = h(mm);
      _monitoredElements = new Map();
      constructor() {}
      monitor(n) {
        if (!this._platform.isBrowser) return Mt;
        this._styleLoader.load(bC);
        let r = bu(n),
          i = this._monitoredElements.get(r);
        if (i) return i.subject;
        let o = new j(),
          s = 'cdk-text-field-autofilled',
          a = (c) => {
            c.animationName === 'cdk-text-field-autofill-start' && !r.classList.contains(s)
              ? (r.classList.add(s),
                this._ngZone.run(() => o.next({ target: c.target, isAutofilled: !0 })))
              : c.animationName === 'cdk-text-field-autofill-end' &&
                r.classList.contains(s) &&
                (r.classList.remove(s),
                this._ngZone.run(() => o.next({ target: c.target, isAutofilled: !1 })));
          },
          l = this._ngZone.runOutsideAngular(
            () => (
              r.classList.add('cdk-text-field-autofill-monitored'),
              this._renderer.listen(r, 'animationstart', a, DC)
            ),
          );
        return (this._monitoredElements.set(r, { subject: o, unlisten: l }), o);
      }
      stopMonitoring(n) {
        let r = bu(n),
          i = this._monitoredElements.get(r);
        i &&
          (i.unlisten(),
          i.subject.complete(),
          r.classList.remove('cdk-text-field-autofill-monitored'),
          r.classList.remove('cdk-text-field-autofilled'),
          this._monitoredElements.delete(r));
      }
      ngOnDestroy() {
        this._monitoredElements.forEach((n, r) => this.stopMonitoring(r));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var Hm = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = re({ type: e });
    static ɵinj = Y({});
  }
  return e;
})();
function Ou(e) {
  return e == null || Fu(e) === 0;
}
function Fu(e) {
  return e == null
    ? null
    : Array.isArray(e) || typeof e == 'string'
      ? e.length
      : e instanceof Set
        ? e.size
        : null;
}
var Ym = new v(''),
  Qm = new v(''),
  EC =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  Ws = class {
    static min(t) {
      return CC(t);
    }
    static max(t) {
      return wC(t);
    }
    static required(t) {
      return IC(t);
    }
    static requiredTrue(t) {
      return MC(t);
    }
    static email(t) {
      return TC(t);
    }
    static minLength(t) {
      return SC(t);
    }
    static maxLength(t) {
      return xC(t);
    }
    static pattern(t) {
      return AC(t);
    }
    static nullValidator(t) {
      return Km();
    }
    static compose(t) {
      return rg(t);
    }
    static composeAsync(t) {
      return ig(t);
    }
  };
function CC(e) {
  return (t) => {
    if (t.value == null || e == null) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n < e ? { min: { min: e, actual: t.value } } : null;
  };
}
function wC(e) {
  return (t) => {
    if (t.value == null || e == null) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n > e ? { max: { max: e, actual: t.value } } : null;
  };
}
function IC(e) {
  return Ou(e.value) ? { required: !0 } : null;
}
function MC(e) {
  return e.value === !0 ? null : { required: !0 };
}
function TC(e) {
  return Ou(e.value) || EC.test(e.value) ? null : { email: !0 };
}
function SC(e) {
  return (t) => {
    let n = t.value?.length ?? Fu(t.value);
    return n === null || n === 0
      ? null
      : n < e
        ? { minlength: { requiredLength: e, actualLength: n } }
        : null;
  };
}
function xC(e) {
  return (t) => {
    let n = t.value?.length ?? Fu(t.value);
    return n !== null && n > e ? { maxlength: { requiredLength: e, actualLength: n } } : null;
  };
}
function AC(e) {
  if (!e) return Km;
  let t, n;
  return (
    typeof e == 'string'
      ? ((n = ''),
        e.charAt(0) !== '^' && (n += '^'),
        (n += e),
        e.charAt(e.length - 1) !== '$' && (n += '$'),
        (t = new RegExp(n)))
      : ((n = e.toString()), (t = e)),
    (r) => {
      if (Ou(r.value)) return null;
      let i = r.value;
      return t.test(i) ? null : { pattern: { requiredPattern: n, actualValue: i } };
    }
  );
}
function Km(e) {
  return null;
}
function Xm(e) {
  return e != null;
}
function Jm(e) {
  return In(e) ? we(e) : e;
}
function eg(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? M(M({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function tg(e, t) {
  return t.map((n) => n(e));
}
function NC(e) {
  return !e.validate;
}
function ng(e) {
  return e.map((t) => (NC(t) ? t : (n) => t.validate(n)));
}
function rg(e) {
  if (!e) return null;
  let t = e.filter(Xm);
  return t.length == 0
    ? null
    : function (n) {
        return eg(tg(n, t));
      };
}
function ku(e) {
  return e != null ? rg(ng(e)) : null;
}
function ig(e) {
  if (!e) return null;
  let t = e.filter(Xm);
  return t.length == 0
    ? null
    : function (n) {
        let r = tg(n, t).map(Jm);
        return Ea(r).pipe(U(eg));
      };
}
function Pu(e) {
  return e != null ? ig(ng(e)) : null;
}
function $m(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function og(e) {
  return e._rawValidators;
}
function sg(e) {
  return e._rawAsyncValidators;
}
function Nu(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function qs(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function zm(e, t) {
  let n = Nu(t);
  return (
    Nu(e).forEach((i) => {
      qs(n, i) || n.push(i);
    }),
    n
  );
}
function Gm(e, t) {
  return Nu(t).filter((n) => !qs(e, n));
}
var Zs = class {
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
      ((this._rawValidators = t || []), (this._composedValidatorFn = ku(this._rawValidators)));
    }
    _setAsyncValidators(t) {
      ((this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = Pu(this._rawAsyncValidators)));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      (this._onDestroyCallbacks.forEach((t) => t()), (this._onDestroyCallbacks = []));
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1;
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null;
    }
  },
  xr = class extends Zs {
    name;
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  Ys = class extends Zs {
    _parent = null;
    name = null;
    valueAccessor = null;
  };
var RC = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  tU = R(M({}, RC), { '[class.ng-submitted]': 'isSubmitted' });
var Ti = 'VALID',
  Gs = 'INVALID',
  Tr = 'PENDING',
  Si = 'DISABLED',
  $t = class {},
  Qs = class extends $t {
    value;
    source;
    constructor(t, n) {
      (super(), (this.value = t), (this.source = n));
    }
  },
  Ai = class extends $t {
    pristine;
    source;
    constructor(t, n) {
      (super(), (this.pristine = t), (this.source = n));
    }
  },
  Ni = class extends $t {
    touched;
    source;
    constructor(t, n) {
      (super(), (this.touched = t), (this.source = n));
    }
  },
  Sr = class extends $t {
    status;
    source;
    constructor(t, n) {
      (super(), (this.status = t), (this.source = n));
    }
  },
  Ks = class extends $t {
    source;
    constructor(t) {
      (super(), (this.source = t));
    }
  },
  Xs = class extends $t {
    source;
    constructor(t) {
      (super(), (this.source = t));
    }
  };
function ag(e) {
  return (ra(e) ? e.validators : e) || null;
}
function OC(e) {
  return Array.isArray(e) ? ku(e) : e || null;
}
function lg(e, t) {
  return (ra(t) ? t.asyncValidators : e) || null;
}
function FC(e) {
  return Array.isArray(e) ? Pu(e) : e || null;
}
function ra(e) {
  return e != null && !Array.isArray(e) && typeof e == 'object';
}
function kC(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new y(1e3, '');
  if (!r[n]) throw new y(1001, '');
}
function PC(e, t, n) {
  e._forEachChild((r, i) => {
    if (n[i] === void 0) throw new y(1002, '');
  });
}
var Js = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {};
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, n) {
      (this._assignValidators(t), this._assignAsyncValidators(n));
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return ke(this.statusReactive);
    }
    set status(t) {
      ke(() => this.statusReactive.set(t));
    }
    _status = ye(() => this.statusReactive());
    statusReactive = ne(void 0);
    get valid() {
      return this.status === Ti;
    }
    get invalid() {
      return this.status === Gs;
    }
    get pending() {
      return this.status == Tr;
    }
    get disabled() {
      return this.status === Si;
    }
    get enabled() {
      return this.status !== Si;
    }
    errors;
    get pristine() {
      return ke(this.pristineReactive);
    }
    set pristine(t) {
      ke(() => this.pristineReactive.set(t));
    }
    _pristine = ye(() => this.pristineReactive());
    pristineReactive = ne(!0);
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return ke(this.touchedReactive);
    }
    set touched(t) {
      ke(() => this.touchedReactive.set(t));
    }
    _touched = ye(() => this.touchedReactive());
    touchedReactive = ne(!1);
    get untouched() {
      return !this.touched;
    }
    _events = new j();
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
      return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(zm(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(zm(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(Gm(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(Gm(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return qs(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return qs(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      let n = this.touched === !1;
      this.touched = !0;
      let r = t.sourceControl ?? this;
      (this._parent && !t.onlySelf && this._parent.markAsTouched(R(M({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new Ni(!0, r)));
    }
    markAllAsDirty(t = {}) {
      (this.markAsDirty({ onlySelf: !0, emitEvent: t.emitEvent, sourceControl: this }),
        this._forEachChild((n) => n.markAllAsDirty(t)));
    }
    markAllAsTouched(t = {}) {
      (this.markAsTouched({ onlySelf: !0, emitEvent: t.emitEvent, sourceControl: this }),
        this._forEachChild((n) => n.markAllAsTouched(t)));
    }
    markAsUntouched(t = {}) {
      let n = this.touched === !0;
      ((this.touched = !1), (this._pendingTouched = !1));
      let r = t.sourceControl ?? this;
      (this._forEachChild((i) => {
        i.markAsUntouched({ onlySelf: !0, emitEvent: t.emitEvent, sourceControl: r });
      }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
        n && t.emitEvent !== !1 && this._events.next(new Ni(!1, r)));
    }
    markAsDirty(t = {}) {
      let n = this.pristine === !0;
      this.pristine = !1;
      let r = t.sourceControl ?? this;
      (this._parent && !t.onlySelf && this._parent.markAsDirty(R(M({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new Ai(!1, r)));
    }
    markAsPristine(t = {}) {
      let n = this.pristine === !1;
      ((this.pristine = !0), (this._pendingDirty = !1));
      let r = t.sourceControl ?? this;
      (this._forEachChild((i) => {
        i.markAsPristine({ onlySelf: !0, emitEvent: t.emitEvent });
      }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
        n && t.emitEvent !== !1 && this._events.next(new Ai(!0, r)));
    }
    markAsPending(t = {}) {
      this.status = Tr;
      let n = t.sourceControl ?? this;
      (t.emitEvent !== !1 &&
        (this._events.next(new Sr(this.status, n)), this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(R(M({}, t), { sourceControl: n })));
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      ((this.status = Si),
        (this.errors = null),
        this._forEachChild((i) => {
          i.disable(R(M({}, t), { onlySelf: !0 }));
        }),
        this._updateValue());
      let r = t.sourceControl ?? this;
      (t.emitEvent !== !1 &&
        (this._events.next(new Qs(this.value, r)),
        this._events.next(new Sr(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(R(M({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((i) => i(!0)));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      ((this.status = Ti),
        this._forEachChild((r) => {
          r.enable(R(M({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(R(M({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((r) => r(!1)));
    }
    _updateAncestors(t, n) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, n),
        this._parent._updateTouched({}, n));
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let r = this._cancelExistingSubscription();
        ((this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === Ti || this.status === Tr) && this._runAsyncValidator(r, t.emitEvent));
      }
      let n = t.sourceControl ?? this;
      (t.emitEvent !== !1 &&
        (this._events.next(new Qs(this.value, n)),
        this._events.next(new Sr(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(R(M({}, t), { sourceControl: n })));
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      (this._forEachChild((n) => n._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }));
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? Si : Ti;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t, n) {
      if (this.asyncValidator) {
        ((this.status = Tr),
          (this._hasOwnPendingAsyncValidator = {
            emitEvent: n !== !1,
            shouldHaveEmitted: t !== !1,
          }));
        let r = Jm(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((i) => {
          ((this._hasOwnPendingAsyncValidator = null),
            this.setErrors(i, { emitEvent: n, shouldHaveEmitted: t }));
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let t =
          (this._hasOwnPendingAsyncValidator?.emitEvent ||
            this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ??
          !1;
        return ((this._hasOwnPendingAsyncValidator = null), t);
      }
      return !1;
    }
    setErrors(t, n = {}) {
      ((this.errors = t),
        this._updateControlsErrors(n.emitEvent !== !1, this, n.shouldHaveEmitted));
    }
    get(t) {
      let n = t;
      return n == null || (Array.isArray(n) || (n = n.split('.')), n.length === 0)
        ? null
        : n.reduce((r, i) => r && r._find(i), this);
    }
    getError(t, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[t] : null;
    }
    hasError(t, n) {
      return !!this.getError(t, n);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t, n, r) {
      ((this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        (t || r) && this._events.next(new Sr(this.status, n)),
        this._parent && this._parent._updateControlsErrors(t, n, r));
    }
    _initObservables() {
      ((this.valueChanges = new z()), (this.statusChanges = new z()));
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? Si
        : this.errors
          ? Gs
          : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Tr)
            ? Tr
            : this._anyControlsHaveStatus(Gs)
              ? Gs
              : Ti;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((n) => n.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t, n) {
      let r = !this._anyControlsDirty(),
        i = this.pristine !== r;
      ((this.pristine = r),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
        i && this._events.next(new Ai(this.pristine, n)));
    }
    _updateTouched(t = {}, n) {
      ((this.touched = this._anyControlsTouched()),
        this._events.next(new Ni(this.touched, n)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, n));
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      ra(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let n = this._parent && this._parent.dirty;
      return !t && !!n && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      ((this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = OC(this._rawValidators)));
    }
    _assignAsyncValidators(t) {
      ((this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = FC(this._rawAsyncValidators)));
    }
  },
  ea = class extends Js {
    constructor(t, n, r) {
      (super(ag(n), lg(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }));
    }
    controls;
    registerControl(t, n) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(t, n, r = {}) {
      (this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange());
    }
    removeControl(t, n = {}) {
      (this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange());
    }
    setControl(t, n, r = {}) {
      (this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        n && this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange());
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, n = {}) {
      (PC(this, !0, t),
        Object.keys(t).forEach((r) => {
          (kC(this, !0, r),
            this.controls[r].setValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent }));
        }),
        this.updateValueAndValidity(n));
    }
    patchValue(t, n = {}) {
      t != null &&
        (Object.keys(t).forEach((r) => {
          let i = this.controls[r];
          i && i.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = {}, n = {}) {
      (this._forEachChild((r, i) => {
        r.reset(t ? t[i] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n),
        n?.emitEvent !== !1 && this._events.next(new Xs(this)));
    }
    getRawValue() {
      return this._reduceChildren({}, (t, n, r) => ((t[r] = n.getRawValue()), t));
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (n, r) => (r._syncPendingControls() ? !0 : n));
      return (t && this.updateValueAndValidity({ onlySelf: !0 }), t);
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && t(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        (t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange));
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [n, r] of Object.entries(this.controls)) if (this.contains(n) && t(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (n, r, i) => ((r.enabled || this.disabled) && (n[i] = r.value), n),
      );
    }
    _reduceChildren(t, n) {
      let r = t;
      return (
        this._forEachChild((i, o) => {
          r = n(r, i, o);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls)) if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var cg = new v('', { providedIn: 'root', factory: () => ug }),
  ug = 'always';
function Ru(e, t, n = ug) {
  (Lu(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === 'always') && t.valueAccessor.setDisabledState?.(e.disabled),
    jC(e, t),
    BC(e, t),
    VC(e, t),
    LC(e, t));
}
function Wm(e, t, n = !0) {
  let r = () => {};
  (t.valueAccessor && (t.valueAccessor.registerOnChange(r), t.valueAccessor.registerOnTouched(r)),
    na(e, t),
    e && (t._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {})));
}
function ta(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t);
  });
}
function LC(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r);
    };
    (e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n);
      }));
  }
}
function Lu(e, t) {
  let n = og(e);
  t.validator !== null
    ? e.setValidators($m(n, t.validator))
    : typeof n == 'function' && e.setValidators([n]);
  let r = sg(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators($m(r, t.asyncValidator))
    : typeof r == 'function' && e.setAsyncValidators([r]);
  let i = () => e.updateValueAndValidity();
  (ta(t._rawValidators, i), ta(t._rawAsyncValidators, i));
}
function na(e, t) {
  let n = !1;
  if (e !== null) {
    if (t.validator !== null) {
      let i = og(e);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== t.validator);
        o.length !== i.length && ((n = !0), e.setValidators(o));
      }
    }
    if (t.asyncValidator !== null) {
      let i = sg(e);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== t.asyncValidator);
        o.length !== i.length && ((n = !0), e.setAsyncValidators(o));
      }
    }
  }
  let r = () => {};
  return (ta(t._rawValidators, r), ta(t._rawAsyncValidators, r), n);
}
function jC(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    ((e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === 'change' && dg(e, t));
  });
}
function VC(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    ((e._pendingTouched = !0),
      e.updateOn === 'blur' && e._pendingChange && dg(e, t),
      e.updateOn !== 'submit' && e.markAsTouched());
  });
}
function dg(e, t) {
  (e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1));
}
function BC(e, t) {
  let n = (r, i) => {
    (t.valueAccessor.writeValue(r), i && t.viewToModelUpdate(r));
  };
  (e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    }));
}
function fg(e, t) {
  (e == null, Lu(e, t));
}
function UC(e, t) {
  return na(e, t);
}
function hg(e, t) {
  (e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === 'submit' &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    }));
}
function HC(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
var $C = { provide: xr, useExisting: an(() => ju) },
  xi = Promise.resolve(),
  ju = (() => {
    class e extends xr {
      callSetDisabledState;
      get submitted() {
        return ke(this.submittedReactive);
      }
      _submitted = ye(() => this.submittedReactive());
      submittedReactive = ne(!1);
      _directives = new Set();
      form;
      ngSubmit = new z();
      options;
      constructor(n, r, i) {
        (super(), (this.callSetDisabledState = i), (this.form = new ea({}, ku(n), Pu(r))));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(n) {
        xi.then(() => {
          let r = this._findContainer(n.path);
          ((n.control = r.registerControl(n.name, n.control)),
            Ru(n.control, n, this.callSetDisabledState),
            n.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(n));
        });
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        xi.then(() => {
          let r = this._findContainer(n.path);
          (r && r.removeControl(n.name), this._directives.delete(n));
        });
      }
      addFormGroup(n) {
        xi.then(() => {
          let r = this._findContainer(n.path),
            i = new ea({});
          (fg(i, n), r.registerControl(n.name, i), i.updateValueAndValidity({ emitEvent: !1 }));
        });
      }
      removeFormGroup(n) {
        xi.then(() => {
          let r = this._findContainer(n.path);
          r && r.removeControl(n.name);
        });
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        xi.then(() => {
          this.form.get(n.path).setValue(r);
        });
      }
      setValue(n) {
        this.control.setValue(n);
      }
      onSubmit(n) {
        return (
          this.submittedReactive.set(!0),
          hg(this.form, this._directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Ks(this.control)),
          n?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        (this.form.reset(n), this.submittedReactive.set(!1));
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(n) {
        return (n.pop(), n.length ? this.form.get(n) : this.form);
      }
      static ɵfac = function (r) {
        return new (r || e)(le(Ym, 10), le(Qm, 10), le(cg, 8));
      };
      static ɵdir = $({
        type: e,
        selectors: [
          ['form', 3, 'ngNoForm', '', 3, 'formGroup', ''],
          ['ng-form'],
          ['', 'ngForm', ''],
        ],
        hostBindings: function (r, i) {
          r & 1 &&
            Te('submit', function (s) {
              return i.onSubmit(s);
            })('reset', function () {
              return i.onReset();
            });
        },
        inputs: { options: [0, 'ngFormOptions', 'options'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        standalone: !1,
        features: [bt([$C]), ii],
      });
    }
    return e;
  })();
function qm(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Zm(e) {
  return (
    typeof e == 'object' &&
    e !== null &&
    Object.keys(e).length === 2 &&
    'value' in e &&
    'disabled' in e
  );
}
var zC = class extends Js {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = !1;
  constructor(t = null, n, r) {
    (super(ag(n), lg(r, n)),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
      ra(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (Zm(t) ? (this.defaultValue = t.value) : (this.defaultValue = t)));
  }
  setValue(t, n = {}) {
    ((this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) => r(this.value, n.emitViewToModelChange !== !1)),
      this.updateValueAndValidity(n));
  }
  patchValue(t, n = {}) {
    this.setValue(t, n);
  }
  reset(t = this.defaultValue, n = {}) {
    (this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1),
      n?.emitEvent !== !1 && this._events.next(new Xs(this)));
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    qm(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    qm(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, { onlySelf: !0, emitModelToViewChange: !1 }), !0)
      : !1;
  }
  _applyFormState(t) {
    Zm(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var GC = (e) => e instanceof zC;
var WC = { provide: xr, useExisting: an(() => Vu) },
  Vu = (() => {
    class e extends xr {
      callSetDisabledState;
      get submitted() {
        return ke(this._submittedReactive);
      }
      set submitted(n) {
        this._submittedReactive.set(n);
      }
      _submitted = ye(() => this._submittedReactive());
      _submittedReactive = ne(!1);
      _oldForm;
      _onCollectionChange = () => this._updateDomValue();
      directives = [];
      form = null;
      ngSubmit = new z();
      constructor(n, r, i) {
        (super(),
          (this.callSetDisabledState = i),
          this._setValidators(n),
          this._setAsyncValidators(r));
      }
      ngOnChanges(n) {
        n.hasOwnProperty('form') &&
          (this._updateValidators(),
          this._updateDomValue(),
          this._updateRegistrations(),
          (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (na(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let r = this.form.get(n.path);
        return (
          Ru(r, n, this.callSetDisabledState),
          r.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          r
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        (Wm(n.control || null, n, !1), HC(this.directives, n));
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        this.form.get(n.path).setValue(r);
      }
      onSubmit(n) {
        return (
          this._submittedReactive.set(!0),
          hg(this.form, this.directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Ks(this.control)),
          n?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0, r = {}) {
        (this.form.reset(n, r), this._submittedReactive.set(!1));
      }
      _updateDomValue() {
        (this.directives.forEach((n) => {
          let r = n.control,
            i = this.form.get(n.path);
          r !== i &&
            (Wm(r || null, n), GC(i) && (Ru(i, n, this.callSetDisabledState), (n.control = i)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 }));
      }
      _setUpFormContainer(n) {
        let r = this.form.get(n.path);
        (fg(r, n), r.updateValueAndValidity({ emitEvent: !1 }));
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let r = this.form.get(n.path);
          r && UC(r, n) && r.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        (this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {}));
      }
      _updateValidators() {
        (Lu(this.form, this), this._oldForm && na(this._oldForm, this));
      }
      static ɵfac = function (r) {
        return new (r || e)(le(Ym, 10), le(Qm, 10), le(cg, 8));
      };
      static ɵdir = $({
        type: e,
        selectors: [['', 'formGroup', '']],
        hostBindings: function (r, i) {
          r & 1 &&
            Te('submit', function (s) {
              return i.onSubmit(s);
            })('reset', function () {
              return i.onReset();
            });
        },
        inputs: { form: [0, 'formGroup', 'form'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        standalone: !1,
        features: [bt([WC]), ii, it],
      });
    }
    return e;
  })();
var pg = new v('MAT_INPUT_VALUE_ACCESSOR');
var mg = (() => {
  class e {
    isErrorState(n, r) {
      return !!(n && n.invalid && (n.touched || (r && r.submitted)));
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var ia = class {
  _defaultMatcher;
  ngControl;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  errorState = !1;
  matcher;
  constructor(t, n, r, i, o) {
    ((this._defaultMatcher = t),
      (this.ngControl = n),
      (this._parentFormGroup = r),
      (this._parentForm = i),
      (this._stateChanges = o));
  }
  updateErrorState() {
    let t = this.errorState,
      n = this._parentFormGroup || this._parentForm,
      r = this.matcher || this._defaultMatcher,
      i = this.ngControl ? this.ngControl.control : null,
      o = r?.isErrorState(i, n) ?? !1;
    o !== t && ((this.errorState = o), this._stateChanges.next());
  }
};
var qC = ['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'],
  ZC = new v('MAT_INPUT_CONFIG'),
  gg = (() => {
    class e {
      _elementRef = h(Q);
      _platform = h(We);
      ngControl = h(Ys, { optional: !0, self: !0 });
      _autofillMonitor = h(Um);
      _ngZone = h(A);
      _formField = h(zs, { optional: !0 });
      _renderer = h(Vt);
      _uid = h(Er).getId('mat-input-');
      _previousNativeValue;
      _inputValueAccessor;
      _signalBasedValueAccessor;
      _previousPlaceholder;
      _errorStateTracker;
      _config = h(ZC, { optional: !0 });
      _cleanupIosKeyup;
      _cleanupWebkitWheel;
      _isServer;
      _isNativeSelect;
      _isTextarea;
      _isInFormField;
      focused = !1;
      stateChanges = new j();
      controlType = 'mat-input';
      autofilled = !1;
      get disabled() {
        return this._disabled;
      }
      set disabled(n) {
        ((this._disabled = Cr(n)), this.focused && ((this.focused = !1), this.stateChanges.next()));
      }
      _disabled = !1;
      get id() {
        return this._id;
      }
      set id(n) {
        this._id = n || this._uid;
      }
      _id;
      placeholder;
      name;
      get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Ws.required) ?? !1;
      }
      set required(n) {
        this._required = Cr(n);
      }
      _required;
      get type() {
        return this._type;
      }
      set type(n) {
        ((this._type = n || 'text'),
          this._validateType(),
          !this._isTextarea &&
            Su().has(this._type) &&
            (this._elementRef.nativeElement.type = this._type));
      }
      _type = 'text';
      get errorStateMatcher() {
        return this._errorStateTracker.matcher;
      }
      set errorStateMatcher(n) {
        this._errorStateTracker.matcher = n;
      }
      userAriaDescribedBy;
      get value() {
        return this._signalBasedValueAccessor
          ? this._signalBasedValueAccessor.value()
          : this._inputValueAccessor.value;
      }
      set value(n) {
        n !== this.value &&
          (this._signalBasedValueAccessor
            ? this._signalBasedValueAccessor.value.set(n)
            : (this._inputValueAccessor.value = n),
          this.stateChanges.next());
      }
      get readonly() {
        return this._readonly;
      }
      set readonly(n) {
        this._readonly = Cr(n);
      }
      _readonly = !1;
      disabledInteractive;
      get errorState() {
        return this._errorStateTracker.errorState;
      }
      set errorState(n) {
        this._errorStateTracker.errorState = n;
      }
      _neverEmptyInputTypes = [
        'date',
        'datetime',
        'datetime-local',
        'month',
        'time',
        'week',
      ].filter((n) => Su().has(n));
      constructor() {
        let n = h(ju, { optional: !0 }),
          r = h(Vu, { optional: !0 }),
          i = h(mg),
          o = h(pg, { optional: !0, self: !0 }),
          s = this._elementRef.nativeElement,
          a = s.nodeName.toLowerCase();
        (o
          ? Bo(o.value)
            ? (this._signalBasedValueAccessor = o)
            : (this._inputValueAccessor = o)
          : (this._inputValueAccessor = s),
          (this._previousNativeValue = this.value),
          (this.id = this.id),
          this._platform.IOS &&
            this._ngZone.runOutsideAngular(() => {
              this._cleanupIosKeyup = this._renderer.listen(s, 'keyup', this._iOSKeyupListener);
            }),
          (this._errorStateTracker = new ia(i, this.ngControl, r, n, this.stateChanges)),
          (this._isServer = !this._platform.isBrowser),
          (this._isNativeSelect = a === 'select'),
          (this._isTextarea = a === 'textarea'),
          (this._isInFormField = !!this._formField),
          (this.disabledInteractive = this._config?.disabledInteractive || !1),
          this._isNativeSelect &&
            (this.controlType = s.multiple ? 'mat-native-select-multiple' : 'mat-native-select'),
          this._signalBasedValueAccessor &&
            Dt(() => {
              (this._signalBasedValueAccessor.value(), this.stateChanges.next());
            }));
      }
      ngAfterViewInit() {
        this._platform.isBrowser &&
          this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((n) => {
            ((this.autofilled = n.isAutofilled), this.stateChanges.next());
          });
      }
      ngOnChanges() {
        this.stateChanges.next();
      }
      ngOnDestroy() {
        (this.stateChanges.complete(),
          this._platform.isBrowser &&
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),
          this._cleanupIosKeyup?.(),
          this._cleanupWebkitWheel?.());
      }
      ngDoCheck() {
        (this.ngControl &&
          (this.updateErrorState(),
          this.ngControl.disabled !== null &&
            this.ngControl.disabled !== this.disabled &&
            ((this.disabled = this.ngControl.disabled), this.stateChanges.next())),
          this._dirtyCheckNativeValue(),
          this._dirtyCheckPlaceholder());
      }
      focus(n) {
        this._elementRef.nativeElement.focus(n);
      }
      updateErrorState() {
        this._errorStateTracker.updateErrorState();
      }
      _focusChanged(n) {
        if (n !== this.focused) {
          if (!this._isNativeSelect && n && this.disabled && this.disabledInteractive) {
            let r = this._elementRef.nativeElement;
            r.type === 'number'
              ? ((r.type = 'text'), r.setSelectionRange(0, 0), (r.type = 'number'))
              : r.setSelectionRange(0, 0);
          }
          ((this.focused = n), this.stateChanges.next());
        }
      }
      _onInput() {}
      _dirtyCheckNativeValue() {
        let n = this._elementRef.nativeElement.value;
        this._previousNativeValue !== n &&
          ((this._previousNativeValue = n), this.stateChanges.next());
      }
      _dirtyCheckPlaceholder() {
        let n = this._getPlaceholder();
        if (n !== this._previousPlaceholder) {
          let r = this._elementRef.nativeElement;
          ((this._previousPlaceholder = n),
            n ? r.setAttribute('placeholder', n) : r.removeAttribute('placeholder'));
        }
      }
      _getPlaceholder() {
        return this.placeholder || null;
      }
      _validateType() {
        qC.indexOf(this._type) > -1;
      }
      _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
      }
      _isBadInput() {
        let n = this._elementRef.nativeElement.validity;
        return n && n.badInput;
      }
      get empty() {
        return (
          !this._isNeverEmpty() &&
          !this._elementRef.nativeElement.value &&
          !this._isBadInput() &&
          !this.autofilled
        );
      }
      get shouldLabelFloat() {
        if (this._isNativeSelect) {
          let n = this._elementRef.nativeElement,
            r = n.options[0];
          return (
            this.focused || n.multiple || !this.empty || !!(n.selectedIndex > -1 && r && r.label)
          );
        } else return (this.focused && !this.disabled) || !this.empty;
      }
      get describedByIds() {
        return this._elementRef.nativeElement.getAttribute('aria-describedby')?.split(' ') || [];
      }
      setDescribedByIds(n) {
        let r = this._elementRef.nativeElement;
        n.length
          ? r.setAttribute('aria-describedby', n.join(' '))
          : r.removeAttribute('aria-describedby');
      }
      onContainerClick() {
        this.focused || this.focus();
      }
      _isInlineSelect() {
        let n = this._elementRef.nativeElement;
        return this._isNativeSelect && (n.multiple || n.size > 1);
      }
      _iOSKeyupListener = (n) => {
        let r = n.target;
        !r.value &&
          r.selectionStart === 0 &&
          r.selectionEnd === 0 &&
          (r.setSelectionRange(1, 1), r.setSelectionRange(0, 0));
      };
      _getReadonlyAttribute() {
        return this._isNativeSelect
          ? null
          : this.readonly || (this.disabled && this.disabledInteractive)
            ? 'true'
            : null;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = $({
        type: e,
        selectors: [
          ['input', 'matInput', ''],
          ['textarea', 'matInput', ''],
          ['select', 'matNativeControl', ''],
          ['input', 'matNativeControl', ''],
          ['textarea', 'matNativeControl', ''],
        ],
        hostAttrs: [1, 'mat-mdc-input-element'],
        hostVars: 21,
        hostBindings: function (r, i) {
          (r & 1 &&
            Te('focus', function () {
              return i._focusChanged(!0);
            })('blur', function () {
              return i._focusChanged(!1);
            })('input', function () {
              return i._onInput();
            }),
            r & 2 &&
              (hr('id', i.id)('disabled', i.disabled && !i.disabledInteractive)(
                'required',
                i.required,
              ),
              _t('name', i.name || null)('readonly', i._getReadonlyAttribute())(
                'aria-disabled',
                i.disabled && i.disabledInteractive ? 'true' : null,
              )('aria-invalid', i.empty && i.required ? null : i.errorState)(
                'aria-required',
                i.required,
              )('id', i.id),
              Fe('mat-input-server', i._isServer)(
                'mat-mdc-form-field-textarea-control',
                i._isInFormField && i._isTextarea,
              )('mat-mdc-form-field-input-control', i._isInFormField)(
                'mat-mdc-input-disabled-interactive',
                i.disabledInteractive,
              )('mdc-text-field__input', i._isInFormField)(
                'mat-mdc-native-select-inline',
                i._isInlineSelect(),
              )));
        },
        inputs: {
          disabled: 'disabled',
          id: 'id',
          placeholder: 'placeholder',
          name: 'name',
          required: 'required',
          type: 'type',
          errorStateMatcher: 'errorStateMatcher',
          userAriaDescribedBy: [0, 'aria-describedby', 'userAriaDescribedBy'],
          value: 'value',
          readonly: 'readonly',
          disabledInteractive: [2, 'disabledInteractive', 'disabledInteractive', pi],
        },
        exportAs: ['matInput'],
        features: [bt([{ provide: $s, useExisting: e }]), it],
      });
    }
    return e;
  })(),
  vg = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = re({ type: e });
      static ɵinj = Y({ imports: [Ir, Mr, Mr, Hm, Ir] });
    }
    return e;
  })();
function QC(e, t) {
  e & 1 && (_s(0), k(1, 'span', 12), ot(2, 'Loading quote...'), P(), bs());
}
function KC(e, t) {
  if ((e & 1 && (k(0, 'blockquote', 13), ot(1), P()), e & 2)) {
    let n = ze();
    (V(), Tn(n.quote));
  }
}
var Bu = class e {
    constructor(t) {
      this.el = t;
    }
    maxFontSize = 80;
    tolerance = 0.95;
    resizeObserver;
    mutationObserver;
    ngAfterViewInit() {
      if (typeof window > 'u') return;
      let t = this.el.nativeElement,
        n = () => {
          if (typeof window > 'u') return;
          let r = t.parentElement;
          if (!r) return;
          t.style.fontSize = `${this.maxFontSize}px`;
          let i = this.maxFontSize;
          for (; t.scrollWidth < r.clientWidth && i < this.maxFontSize; )
            if (((i += 1), (t.style.fontSize = `${i}px`), t.scrollWidth > r.clientWidth)) {
              i -= 1;
              break;
            }
          for (; t.scrollWidth > r.clientWidth && i > 1; )
            ((i -= 1), (t.style.fontSize = `${i}px`));
          let o = parseFloat(getComputedStyle(t).fontSize);
          i / o > this.tolerance && i < o && (t.style.fontSize = o + 'px');
        };
      (n(),
        (this.resizeObserver = new ResizeObserver(n)),
        this.resizeObserver.observe(t.parentElement),
        (this.mutationObserver = new MutationObserver(n)),
        this.mutationObserver.observe(t, { childList: !0, characterData: !0, subtree: !0 }));
    }
    ngOnDestroy() {
      (this.resizeObserver?.disconnect(), this.mutationObserver?.disconnect());
    }
    static ɵfac = function (n) {
      return new (n || e)(le(Q));
    };
    static ɵdir = $({
      type: e,
      selectors: [['', 'appFitText', '']],
      inputs: { maxFontSize: 'maxFontSize', tolerance: 'tolerance' },
    });
  },
  Uu = class e {
    constructor(t) {
      this.http = t;
    }
    apiUrl = 'https://dummyjson.com/quotes/random';
    getRandomQuote() {
      return this.http.get(this.apiUrl);
    }
    static ɵfac = function (n) {
      return new (n || e)(I(Ps));
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: 'root' });
  },
  oa = class e {
    loadFromStorageSafe(t) {
      let n = this.loadFromStorage(t);
      return n?.trim() ? n : null;
    }
    title = ne(this.loadFromStorageSafe('title'));
    date = ne(this.loadFromStorageSafe('date'));
    now = ne(new Date());
    countdownTitle = ye(() => {
      let t = this.title();
      return t && this.isBrowser()
        ? `Time to ${t}`
        : this.isBrowser() && !t
          ? 'Time to your event'
          : '';
    });
    titlePresent = ye(() => this.isBrowser() && !!this.title());
    timeLeftTitle = ye(() => {
      let t = this.date();
      if (this.isBrowser())
        if (t) {
          let n = this.calculateTimeLeft(new Date(t), this.now());
          return n
            ? `${n.days} days, ${n.hours} h, ${n.minutes} m, ${n.seconds} s`
            : 'Countdown finished!';
        } else return 'Enter a date to start countdown';
      else return '';
    });
    quote = null;
    loadingQuote = !0;
    quoteServiceInstance = h(Uu);
    constructor() {
      (Dt(() => {
        let t = this.date();
        !t ||
          (this.now.set(new Date()), new Date(t).getTime() - new Date().getTime() <= 0) ||
          setInterval(() => this.now.set(new Date()), 1e3);
      }),
        Dt(() => {
          this.isBrowser() && localStorage.setItem('title', this.title() || '');
        }),
        Dt(() => {
          this.isBrowser() && localStorage.setItem('date', this.date() || '');
        }));
    }
    ngOnInit() {
      this.fetchQuote();
    }
    fetchQuote() {
      ((this.loadingQuote = !0),
        this.quoteServiceInstance.getRandomQuote().subscribe({
          next: (t) => {
            ((this.quote = t.quote), (this.loadingQuote = !1));
          },
          error: () => {
            ((this.quote = 'Failed to load quote.'), (this.loadingQuote = !1));
          },
        }));
    }
    calculateTimeLeft(t, n) {
      let r = t.getTime() - n.getTime();
      if (r <= 0) return null;
      let i = Math.floor(r / 1e3) % 60,
        o = Math.floor(r / (1e3 * 60)) % 60,
        s = Math.floor(r / (1e3 * 60 * 60)) % 24;
      return { days: Math.floor(r / (1e3 * 60 * 60 * 24)), hours: s, minutes: o, seconds: i };
    }
    isBrowser() {
      return typeof window < 'u' && !!window.localStorage;
    }
    loadFromStorage(t) {
      return this.isBrowser() ? localStorage.getItem(t) : null;
    }
    static ɵfac = function (n) {
      return new (n || e)();
    };
    static ɵcmp = yt({
      type: e,
      selectors: [['app-root']],
      decls: 21,
      vars: 8,
      consts: [
        ['showQuote', ''],
        [1, 'main'],
        ['src', 'logo.webp', 'alt', 'Logo', 'width', '200', 1, 'logo'],
        [1, 'content'],
        ['appFitText', '', 1, 'countdown-title', 3, 'maxFontSize'],
        ['appFitText', '', 1, 'timeLeftTitle', 3, 'maxFontSize'],
        [1, 'quote-container'],
        [4, 'ngIf', 'ngIfElse'],
        [1, 'form'],
        ['appearance', 'outline'],
        ['matInput', '', 'placeholder', 'Enter title', 3, 'input', 'value'],
        ['matInput', '', 'type', 'date', 3, 'input', 'value'],
        [1, 'loader'],
        [1, 'quote'],
      ],
      template: function (n, r) {
        if (n & 1) {
          let i = li();
          (k(0, 'main', 1),
            $e(1, 'img', 2),
            k(2, 'div', 3)(3, 'h1', 4),
            ot(4),
            P(),
            k(5, 'h2', 5),
            ot(6),
            P(),
            k(7, 'div', 6),
            Bt(8, QC, 3, 0, 'ng-container', 7)(9, KC, 2, 1, 'ng-template', null, 0, di),
            P(),
            k(11, 'div', 8)(12, 'mat-form-field', 9)(13, 'mat-label'),
            ot(14, 'Title'),
            P(),
            k(15, 'input', 10),
            Te('input', function (s) {
              return (gn(i), vn(r.title.set(s.target.value)));
            }),
            P()(),
            k(16, 'mat-form-field', 9)(17, 'mat-label'),
            ot(18, 'Date'),
            P(),
            k(19, 'input', 11),
            Te('input', function (s) {
              return (gn(i), vn(r.date.set(s.target.value)));
            }),
            P()()()()(),
            $e(20, 'router-outlet'));
        }
        if (n & 2) {
          let i = mr(10);
          (V(3),
            Ce('maxFontSize', 70),
            V(),
            ui(' ', r.countdownTitle(), ' '),
            V(),
            Ce('maxFontSize', 70),
            V(),
            Tn(r.timeLeftTitle()),
            V(2),
            Ce('ngIf', r.loadingQuote)('ngIfElse', i),
            V(7),
            Ce('value', r.title()),
            V(4),
            Ce('value', r.date()));
        }
      },
      dependencies: [yu, Mr, Mi, Ii, vg, gg, Ms, Yc, Bu],
      styles: [
        'html[_ngcontent-%COMP%], body[_ngcontent-%COMP%]{height:100%;margin:0}body[_ngcontent-%COMP%]{display:flex;flex-direction:column;min-height:100vh}[_nghost-%COMP%]{font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}h1[_ngcontent-%COMP%]{font-size:3rem;font-weight:700;line-height:100%;letter-spacing:-.125rem;margin:0;font-family:Inter Tight,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol}main[_ngcontent-%COMP%]{background-color:#f5f3f3;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:1rem;box-sizing:inherit;position:relative}.logo[_ngcontent-%COMP%]{margin-top:15px}.content[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%}.form[_ngcontent-%COMP%]{display:flex;flex-direction:column;row-gap:1rem}.quote-container[_ngcontent-%COMP%]{width:100%;max-height:300px;min-height:60px;margin:2.5rem;display:flex;align-items:center;justify-content:center;text-align:center}.quote[_ngcontent-%COMP%], .loader[_ngcontent-%COMP%]{margin:0;font-size:1.3rem;line-height:normal}.loader[_ngcontent-%COMP%]{color:gray;text-align:center}.countdown-title[_ngcontent-%COMP%]{color:#72025c;height:50px;white-space:nowrap}.timeLeftTitle[_ngcontent-%COMP%]{height:40px;padding-top:.75rem;margin-bottom:0;width:max-content;font-weight:400;font-size:3rem}@media screen and (min-width: 651px){.form[_ngcontent-%COMP%]{flex-direction:row;column-gap:1.75rem}.quote-container[_ngcontent-%COMP%]{width:75vw;margin-left:auto;margin-right:auto}}',
      ],
    });
  };
su(oa, { providers: [hu(pu())] }).catch((e) => console.error(e));
