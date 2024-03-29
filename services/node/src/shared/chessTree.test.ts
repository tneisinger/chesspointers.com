/* eslint-disable */
import {
  makeChessTree,
  getTreeLines,
  mergeTrees,
  doesTreeReachPosition,
  filterLessonsWithOpenings,
  isLineInTree,
  filterLessonsWithLine,
} from './chessTree';
import { ChessOpening, ChessTreeLine } from './chessTypes';
import allTraps from './lessons/traps';
import { basicCompare } from './utils';

const Bc5 = { move: 'Bc5', teachingPriority: 10 };
const Kd8 = { move: 'Kd8', teachingPriority: 15 };

const branch_Rf1  = makeChessTree(['Rf1', 'Qxe4+', 'Be2', 'Nf3#'], []);
const branch_Nxh8 = makeChessTree(['Nxh8', 'Qxh1+', 'Bf1', 'Qe4+', 'Be2', Bc5], []);
const branch_g3   = makeChessTree(['g3', 'Qxe5'], []);
const branch_Bxf7 = makeChessTree(['Bxf7+', Kd8], []);
const branch_Nxf7 = makeChessTree(['Nxf7', 'Qxg2'], [branch_Rf1, branch_Nxh8]);

const complexTree = makeChessTree(
  [ 'e4',   'e5',
    'Nf3',  'Nc6',
    'Bc4',  'Nd4',
    'Nxe5', 'Qg5',
  ],
  [ branch_g3,
    branch_Nxf7,
    branch_Bxf7
  ]
);

describe('makeChessTree()', () => {
  it('can make a simple tree', () => {
    expect(makeChessTree(['e4'], [])).toStrictEqual({ move: 'e4', children: [] });
  });

  it('can make a long tree with no branches', () => {
    const tree = makeChessTree(
      [ 'e4', 'e5',
        'Nf3', 'Nc6',
      ], []
    );
    expect(tree).toStrictEqual({
      move: 'e4',
      children: [{
        move: 'e5',
        children: [{
          move: 'Nf3',
          children: [{
            move: 'Nc6',
            children: []
          }]
        }]
      }]
    });
  });

  it('can make a tree with a simple branch', () => {
    const tree = makeChessTree(
      ['e4', 'e5'],
      [ { move: 'Nf3', children: [] },
        { move: 'f4', children: [] }
      ]
    );
    expect(tree).toStrictEqual({
      move: 'e4',
      children: [{
        move: 'e5',
        children: [
          { move: 'Nf3', children: [] },
          { move: 'f4', children: [] }
        ]
      }]
    });
  })

  it('can make a complex tree', () => {
    expect(complexTree).toStrictEqual({
      move: 'e4',
      children: [{
        move: 'e5',
        children: [{
          move: 'Nf3',
          children: [{
            move: 'Nc6',
            children: [{
              move: 'Bc4',
              children: [{
                move: 'Nd4',
                children: [{
                  move: 'Nxe5',
                  children: [{
                    move: 'Qg5',
                    children: [
                      {
                        move: 'g3',
                        children: [{
                          move: 'Qxe5',
                          children: []
                        }]
                      },
                      {
                        move: 'Nxf7',
                        children: [{
                          move: 'Qxg2',
                          children: [
                            {
                              move: 'Rf1',
                              children: [{
                                move: 'Qxe4+',
                                children: [{
                                  move: 'Be2',
                                  children: [{
                                    move: 'Nf3#',
                                    children: []
                                  }]
                                }]
                              }]
                            },
                            {
                              move: 'Nxh8',
                              children: [{
                                move: 'Qxh1+',
                                children: [{
                                  move: 'Bf1',
                                  children: [{
                                    move: 'Qe4+',
                                    children: [{
                                      move: 'Be2',
                                      children: [{
                                        move: 'Bc5',
                                        teachingPriority: 10,
                                        children: []
                                      }]
                                    }]
                                  }]
                                }]
                              }]
                            }
                          ]
                        }]
                      },
                      {
                        move: 'Bxf7+',
                        children: [{
                          move: 'Kd8',
                          teachingPriority: 15,
                          children: []
                        }]
                      }
                    ]
                  }]
                }]
              }]
            }],
          }]
        }]
      }]
    });
  });

  it('can make a tree that branches immediately', () => {
    const simpleTree1 = makeChessTree(['e4', 'e5', 'Nf3', 'Nc6'], []);
    const simpleTree2 = makeChessTree(['d4', 'd5', 'c4', 'e5'], []);
    const tree = makeChessTree([], [ simpleTree1, simpleTree2 ]);

    expect(tree).toEqual({
      move: '',
      children: [ simpleTree1, simpleTree2 ],
    });
  });

  it('can make a tree with a defined preview position', () => {
    const e5 = { move: 'e5', isPreviewPosition: true };
    const tree = makeChessTree(
      ['e4', e5],
      [ { move: 'Nf3', children: [] },
        { move: 'f4', children: [] }
      ]
    );
    expect(tree).toStrictEqual({
      move: 'e4',
      children: [{
        move: 'e5',
        isPreviewPosition: true,
        children: [
          { move: 'Nf3', children: [] },
          { move: 'f4', children: [] }
        ]
      }]
    });
  })

  it('can make a tree with defined teachingPriority values', () => {
    const Nf3 = { move: 'Nf3', teachingPriority: 10 };
    const branch_Nf3 = makeChessTree([Nf3],[]);
    const f4 = { move: 'f4', teachingPriority: 5 };
    const branch_f4 = makeChessTree([f4],[]);
    const tree = makeChessTree(
      ['e4', 'e5'],
      [
        branch_Nf3,
        branch_f4
      ]
    );
    expect(tree).toStrictEqual({
      move: 'e4',
      children: [{
        move: 'e5',
        children: [
          {
            move: 'Nf3',
            teachingPriority: 10,
            children: []
          },
          {
            move: 'f4',
            teachingPriority: 5,
            children: []
          }
        ]
      }]
    });
  })
});

describe('getTreeLines(tree)', () => {
  it('works for a tree with no branches', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6'];
    const tree = makeChessTree(moves, []);
    expect(getTreeLines(tree)).toEqual([moves]);
  });

  it('works for a complex tree', () => {
    expect(getTreeLines(complexTree).sort()).toEqual([
      [
        'e4', 'e5',
        'Nf3', 'Nc6',
        'Bc4', 'Nd4',
        'Nxe5', 'Qg5',
        'g3', 'Qxe5'
      ],
      [
        'e4', 'e5',
        'Nf3', 'Nc6',
        'Bc4', 'Nd4',
        'Nxe5', 'Qg5',
        'Nxf7', 'Qxg2',
        'Rf1', 'Qxe4+',
        'Be2', 'Nf3#'
      ],
      [
        'e4', 'e5',
        'Nf3', 'Nc6',
        'Bc4', 'Nd4',
        'Nxe5', 'Qg5',
        'Nxf7', 'Qxg2',
        'Nxh8', 'Qxh1+',
        'Bf1', 'Qe4+',
        'Be2', 'Bc5',
      ],
      [
        'e4', 'e5',
        'Nf3', 'Nc6',
        'Bc4', 'Nd4',
        'Nxe5', 'Qg5',
        'Bxf7+', 'Kd8',
      ]
    ].sort());
  });

  it('works for a tree with just one move', () => {
    const moves = ['e4'];
    const tree = makeChessTree(moves, []);
    expect(getTreeLines(tree)).toEqual([moves]);
  });

  it('works for a tree with no moves', () => {
    const tree = makeChessTree([],[]);
    expect(getTreeLines(tree).length).toEqual(0);
  });
});

describe("getTreeLines(tree, 'verbose')", () => {
  it('works for a tree with no branches', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6'];
    const tree = makeChessTree(moves, []);
    expect(getTreeLines(tree, 'verbose'))
      .toEqual([{ line: moves, teachingPriority: 0}]);
  });

  it('works for a complex tree', () => {
    const received = getTreeLines(complexTree, 'verbose') as ChessTreeLine[];
    received.sort((p1, p2) => basicCompare(p1.line, p2.line));
    const expected = [
      {
        line: [
          'e4', 'e5',
          'Nf3', 'Nc6',
          'Bc4', 'Nd4',
          'Nxe5', 'Qg5',
          'g3', 'Qxe5'
          ],
        teachingPriority: 0,
      },
      {
        line: [
          'e4', 'e5',
          'Nf3', 'Nc6',
          'Bc4', 'Nd4',
          'Nxe5', 'Qg5',
          'Nxf7', 'Qxg2',
          'Rf1', 'Qxe4+',
          'Be2', 'Nf3#'
        ],
        teachingPriority: 0,
      },
      {
        line: [
          'e4', 'e5',
          'Nf3', 'Nc6',
          'Bc4', 'Nd4',
          'Nxe5', 'Qg5',
          'Nxf7', 'Qxg2',
          'Nxh8', 'Qxh1+',
          'Bf1', 'Qe4+',
          'Be2', 'Bc5',
        ],
        teachingPriority: 10,
      },
      {
        line: [
          'e4', 'e5',
          'Nf3', 'Nc6',
          'Bc4', 'Nd4',
          'Nxe5', 'Qg5',
          'Bxf7+', 'Kd8',
        ],
        teachingPriority: 15,
      }
    ].sort((p1, p2) => basicCompare(p1.line, p2.line));

    expect(received).toStrictEqual(expected);
  });

  it('works for a tree with just one move', () => {
    const moves = ['e4'];
    const tree = makeChessTree(moves, []);
    expect(getTreeLines(tree, 'verbose'))
      .toStrictEqual([{ line: moves, teachingPriority: 0 }]);
  });

  it('works for a tree with no moves', () => {
    const tree = makeChessTree([],[]);
    expect(getTreeLines(tree, 'verbose').length).toEqual(0);
  });

  it('includes teachingPriority value when teachingPriority not on leaf', () => {
    const tree = makeChessTree(
      [ 'e4', { move: 'e5', teachingPriority: 100 }, 'Nf3' ],
      [],
    );
    expect(getTreeLines(tree, 'verbose')).toStrictEqual([{
      line: ['e4', 'e5', 'Nf3'],
      teachingPriority: 100
    }]);
  });

  it('uses last teachingPriority value of a line', () => {
    const tree = makeChessTree(
      [ 'e4',
        { move: 'e5', teachingPriority: 100 },
        { move: 'Nf3', teachingPriority: 200 },
      ],
      [],
    );
    expect(getTreeLines(tree, 'verbose')).toStrictEqual([{
      line: ['e4', 'e5', 'Nf3'],
      teachingPriority: 200
    }]);
  });

  it('applies upstream teachingPriority value to all downstream lines', () => {
    const branch_Nf3 = makeChessTree(
      ['Nf3'],
      [],
    );
    const branch_Nc3 = makeChessTree(
      ['Nc3'],
      [],
    );
    const tree = makeChessTree(
      [ 'e4', { move: 'e5', teachingPriority: 100 }],
      [branch_Nf3, branch_Nc3],
    );
    expect(getTreeLines(tree, 'verbose')).toStrictEqual([
      {
        line: ['e4', 'e5', 'Nf3'],
        teachingPriority: 100
      },
      {
        line: ['e4', 'e5', 'Nc3'],
        teachingPriority: 100,
      }
    ]);
  });

  it('overrides upstream teachingPriority with a downstream teachingPriority', () => {
    const branch_Nf3 = makeChessTree(
      ['Nf3'],
      [],
    );
    const branch_Nc3 = makeChessTree(
      [{ move: 'Nc3', teachingPriority: 200 }],
      [],
    );
    const tree = makeChessTree(
      [ 'e4', { move: 'e5', teachingPriority: 100 }],
      [branch_Nf3, branch_Nc3],
    );
    expect(getTreeLines(tree, 'verbose')).toStrictEqual([
      {
        line: ['e4', 'e5', 'Nf3'],
        teachingPriority: 100
      },
      {
        line: ['e4', 'e5', 'Nc3'],
        teachingPriority: 200,
      }
    ]);
  });
});

describe('mergeTrees()', () => {
  it('merges two empty trees into an empty tree', () => {
    const merged = mergeTrees(makeChessTree([],[]), makeChessTree([],[]));
    expect(merged.move).toEqual('');
    expect(merged.children.length).toEqual(0);
  });

  it('merges multiple empty trees into an empty tree', () => {
    const merged = mergeTrees(
      makeChessTree([],[]),
      makeChessTree([],[]),
      makeChessTree([], [])
    );
    expect(merged.move).toEqual('');
    expect(merged.children.length).toEqual(0);
  });

  it('merges an empty tree with a simple tree, returning the simple tree', () => {
    const simpleTree = makeChessTree(['e4', 'e5', 'Nf3', 'Nc6'], []);
    const merged = mergeTrees(
      makeChessTree([],[]),
      simpleTree,
    );
    expect(merged).toEqual(simpleTree);
  });

  it('merges a simple tree with an empty tree, returning the simple tree', () => {
    const simpleTree = makeChessTree(['e4', 'e5', 'Nf3', 'Nc6'], []);
    const merged = mergeTrees(
      simpleTree,
      makeChessTree([],[]),
    );
    expect(merged).toEqual(simpleTree);
  });

  it('merges two simple trees with different first moves', () => {
    const simpleTree1 = makeChessTree(['e4', 'e5', 'Nf3', 'Nc6'], []);
    const simpleTree2 = makeChessTree(['d4', 'd5', 'c4', 'e5'], []);
    const merged = mergeTrees(
      simpleTree1,
      simpleTree2,
    );
    expect(merged).toEqual(
      makeChessTree([], [ simpleTree1, simpleTree2 ])
    );
  });

  it('merges two simple trees with same first moves', () => {
    const simpleTree1 = makeChessTree(['d4', 'd5', 'c4', 'e5'], []);
    const simpleTree2 = makeChessTree(['d4', 'e5', 'dxe5', 'Nc6'], []);
    const merged = mergeTrees(
      simpleTree1,
      simpleTree2,
    );
    expect(merged).toEqual(
      makeChessTree(['d4'], [
        makeChessTree(['d5', 'c4', 'e5'], []),
        makeChessTree(['e5', 'dxe5', 'Nc6'], [])
      ])
    );
  });

  it('merges two simple trees when first three moves are the same', () => {
    const simpleTree1 = makeChessTree(['d4', 'd5', 'c4', 'e5'], []);
    const simpleTree2 = makeChessTree(['d4', 'd5', 'c4', 'dxc4'], []);
    const merged = mergeTrees(simpleTree1, simpleTree2);
    expect(merged).toEqual(
      makeChessTree(['d4', 'd5', 'c4'], [
        makeChessTree(['e5'], []),
        makeChessTree(['dxc4'], [])
      ])
    );
  });

  it('merges two trees that branch immediately', () => {
    const tree1 = makeChessTree([], [
      makeChessTree(['e4', 'e5'], []),
      makeChessTree(['d4', 'd5'], []),
    ]);
    const tree2 = makeChessTree([], [
      makeChessTree(['Nc3', 'Nc6'], []),
      makeChessTree(['Nf3', 'Nf6'], []),
    ]);
    const merged = mergeTrees(tree1, tree2);
    expect(merged).toEqual(
      makeChessTree([], [
        makeChessTree(['e4', 'e5'], []),
        makeChessTree(['d4', 'd5'], []),
        makeChessTree(['Nc3', 'Nc6'], []),
        makeChessTree(['Nf3', 'Nf6'], []),
      ])
    );
  });

  it('merges an immediately-branching tree with a tree with shared first move, ', () => {
    const tree1 = makeChessTree([], [
      makeChessTree(['e4', 'e5'], []),
      makeChessTree(['d4', 'd5'], []),
    ]);
    const tree2 = makeChessTree(['d4', 'e5'], []);
    const merged = mergeTrees(tree1, tree2);
    expect(getTreeLines(merged).sort()).toEqual(
      getTreeLines(
        makeChessTree([], [
          makeChessTree(['e4', 'e5'], []),
          makeChessTree(['d4'], [
            makeChessTree(['d5'], []),
            makeChessTree(['e5'], []),
          ])
        ])
      ).sort()
    );
  });

  it('merges tree with an immediately-branching tree with a shared first move, ', () => {
    const tree1 = makeChessTree(['d4', 'e5'], []);
    const tree2 = makeChessTree([], [
      makeChessTree(['e4', 'e5'], []),
      makeChessTree(['d4', 'd5'], []),
    ]);
    const merged = mergeTrees(tree1, tree2);
    expect(getTreeLines(merged).sort()).toEqual(
      getTreeLines(
        makeChessTree([], [
          makeChessTree(['e4', 'e5'], []),
          makeChessTree(['d4'], [
            makeChessTree(['d5'], []),
            makeChessTree(['e5'], []),
          ])
        ])
      ).sort()
    );
  });
});

describe('doesTreeReachPosition()', () => {
  const italianGameFen =
    'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3';

  it('returns true with italian game fen and the legal trap tree', () => {
    expect(doesTreeReachPosition(italianGameFen, allTraps.legal.chessTree)).toBe(true);
  });

  it('returns false with italian game fen and the englund gambit trap tree', () => {
    expect(
      doesTreeReachPosition(italianGameFen, allTraps.englundGambit.chessTree)
    ).toBe(false);
  });
});

describe('filterTreesWithOpenings()', () => {
  it('returns [] when given no traps and no openings', () => {
    expect(filterLessonsWithOpenings([], [])).toEqual([]);
  });

  it('returns [] when no traps match one opening', () => {
    const traps = [
      allTraps.magnusSmith,
      allTraps.lasker,
      allTraps.englundGambit,
    ];
    expect(filterLessonsWithOpenings([ChessOpening.ItalianGame], traps)).toEqual([]);
  });

  it('returns correct trap when one trap matches one opening', () => {
    const traps = [
      allTraps.magnusSmith,
      allTraps.legal,
      allTraps.englundGambit,
      allTraps.elephant,
    ];
    expect(filterLessonsWithOpenings([ChessOpening.QueensGambit], traps))
      .toStrictEqual([allTraps.elephant]);
  });

  it('returns correct two traps when two traps match one opening', () => {
    const traps = [
      allTraps.magnusSmith,
      allTraps.lasker,
      allTraps.legal,
      allTraps.englundGambit,
      allTraps.elephant,
    ];

    const filtered = filterLessonsWithOpenings([ChessOpening.QueensGambit], traps);
    expect(filtered.map((t) => t.shortName).sort()).toEqual(
      [allTraps.elephant, allTraps.lasker].map((t) => t.shortName).sort()
    );
  });

  it('returns correct three traps when three traps match two openings', () => {
    const traps = [
      allTraps.magnusSmith,
      allTraps.lasker,
      allTraps.legal,
      allTraps.englundGambit,
      allTraps.elephant,
    ];

    const filtered = filterLessonsWithOpenings(
      [ChessOpening.QueensGambit, ChessOpening.SicilianDefense],
      traps
    );
    expect(filtered.map((t) => t.shortName).sort()).toEqual(
      [
        allTraps.elephant,
        allTraps.lasker,
        allTraps.magnusSmith
      ].map((t) => t.shortName).sort()
    );
  });

  it('returns correct trap from many when one of many openings match', () => {
    const traps = [
      allTraps.magnusSmith,
      allTraps.lasker,
      allTraps.legal,
      allTraps.elephant,
    ];

    const openings = [
      ChessOpening.CaroKannDefense,
      ChessOpening.SicilianDefense,
    ];

    const filtered = filterLessonsWithOpenings(openings, traps);
    expect(filtered.map((t) => t.shortName).sort()).toEqual(
      [allTraps.magnusSmith].map((t) => t.shortName).sort()
    );
  });
});

describe('isLineInTree()', () => {
  it('returns false if the line is not in tree', () => {
    expect(isLineInTree(['e4', 'e5'], allTraps.magnusSmith.chessTree)).toBe(false);
  });

  it('returns true if the line is in the tree', () => {
    expect(isLineInTree(['e4', 'e5'], allTraps.legal.chessTree)).toBe(true);
  });
});

describe('filterTrapsWithLine()', () => {
  const traps = [
    allTraps.legal,
    allTraps.englundGambit,
    allTraps.elephant,
    allTraps.lasker,
    allTraps.magnusSmith,
  ];

  it('returns no traps if line does not match any of the traps', () => {
    expect(filterLessonsWithLine(['a4', 'a5'], traps)).toEqual([]);
  });

  it('returns correct trap if line matches one of the traps', () => {
    expect(filterLessonsWithLine(['d4', 'e5'], traps))
      .toStrictEqual([allTraps.englundGambit]);
  });

  it('returns multiple correct traps if line matches multiple of the traps', () => {
    const filtered = filterLessonsWithLine(['d4', 'd5'], traps)
    expect(filtered.map((t) => t.shortName).sort())
      .toEqual([allTraps.lasker, allTraps.elephant].map((t) => t.shortName).sort());
  });
});
