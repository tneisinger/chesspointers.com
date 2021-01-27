/* eslint-disable */
import {
  makeChessTree,
  getUniquePaths,
  mergeTrees,
  doesTreeReachPosition,
} from './chessTree';
import { legalTrap, englundGambitTrap } from './chessTraps';

const branch_Rf1  = makeChessTree(['Rf1', 'Qxe4+', 'Be2', 'Nf3#'], []);
const branch_Nxh8 = makeChessTree(['Nxh8', 'Qxh1+', 'Bf1', 'Qe4+', 'Be2', 'Bc5'], []);
const branch_g3   = makeChessTree(['g3', 'Qxe5'], []);
const branch_Bxf7 = makeChessTree(['Bxf7+', 'Kd8'], []);
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
});

describe('getUniquePaths()', () => {
  it('works for a tree with no branches', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6'];
    const tree = makeChessTree(moves, []);
    expect(getUniquePaths(tree)).toEqual([moves]);
  });

  it('works for a complex tree', () => {
    expect(getUniquePaths(complexTree)).toEqual([
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
    expect(getUniquePaths(merged).sort()).toEqual(
      getUniquePaths(
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
    expect(getUniquePaths(merged).sort()).toEqual(
      getUniquePaths(
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
    'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1';

  it('returns true with italian game fen and the legal trap tree', () => {
    expect(doesTreeReachPosition(italianGameFen, legalTrap.chessTree)).toBe(true);
  });

  it('returns false with italian game fen and the englund gambit trap tree', () => {
    expect(
      doesTreeReachPosition(italianGameFen, englundGambitTrap.chessTree)
    ).toBe(false);
  });
});
